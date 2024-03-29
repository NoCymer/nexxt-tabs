import $ from "jquery"
import appManager from "../AppManager";
import backgroundsJSON from "@Public/backgrounds/backgrounds.json"
import backgroundsDB from "./BackgroundsDatabase";

type ID = string;

/**
 * Background Manager Singleton
 */
export default class BackgroundsManager {
    /** Duration of the crossfade animation in ms*/
    private readonly CROSSFADE_DURATION = 750;
    
    private static _instance: BackgroundsManager;

    private readonly _bgCycleIntervalSetting = appManager
        .getSetting("background-cycle-interval-integer");

    private readonly _bgIDsArray = appManager
        .getSetting("background-ids-array");

    private readonly _bgCycleIntervalUnitSetting = appManager
        .getSetting("background-cycle-interval-unit-string");

    private readonly _bgSelectedIdsSetting = appManager
        .getSetting("background-id-selected-array");

    private readonly _bgCurrentIdSetting = appManager
        .getSetting("background-id-current-integer");

    private readonly _bgIdsCycleHistorySetting = appManager
        .getSetting("background-id-cycle-history-array");
        
    private readonly _bgCycleSetting = appManager
        .getSetting("background-cycle-boolean");
        
    private readonly _bgShuffleSetting = appManager
        .getSetting("background-shuffle-boolean" );

    private static readonly backgroundsBD = backgroundsDB;

    private interval: NodeJS.Timer; 

    /** Instance of the background manager */
    public static get instance(): BackgroundsManager {
        if(!BackgroundsManager._instance) {
            BackgroundsManager._instance = new BackgroundsManager();
        }
        return BackgroundsManager._instance;
    }
    
    /** Determines if the backgrounds will cycle or not */
    private _canCycle = true;

    /** Layer to change for crossfade effect */
    private layerToChange = 1

    /**
     * Returns the total number of backgrounds loaded.
     */
    public static async getBackgroundsCount() {
        return (await this.backgroundsBD.fetchIds()).length
        + backgroundsJSON.length;
    }

    /**
     * Returns all loaded backgrounds IDs
     */
    public static async getBackgroundsIDs(): Promise<ID[]> {
        let ids: ID[] = Array.from(backgroundsJSON);
        ids.push(...await this.backgroundsBD.fetchIds());
        return ids;
    }

    /**
     * Initializes the BackgroundManager
     */
    public async init() {
        const backgroundIds = await BackgroundsManager.getBackgroundsIDs();

        this._bgIDsArray.value = backgroundIds;
        // Verifying the validity of all selected IDs
        let temp = this._bgSelectedIdsSetting.value;
        this._bgSelectedIdsSetting.value = temp.filter((id: ID) => {
            return backgroundIds.includes(id);
        })

        if(this._bgSelectedIdsSetting.value.length === 0) {
            this._bgSelectedIdsSetting.value = backgroundIds;
        } 

        const restartInterval = () => {
            if(this.interval) clearInterval(this.interval);
            this.interval = setInterval(
                this.cycleBackground, this.storedIntervalMS()
            );
        }

        // Restarts an interval when cycle interval value changes  
        // with the new intervalvalue and clears the old one
        this._bgCycleIntervalSetting.subscribe(restartInterval);
        this._bgCycleIntervalUnitSetting.subscribe(restartInterval);

        // Cycle background logic
        if(this._bgCycleSetting.value) {
            // Initialize the first background.
            await this.changeBackgroundToIDInstant(this.getNextID());
    
            // Background cycling initialisation
            this.interval = setInterval(
                this.cycleBackground, this.storedIntervalMS()
            );
        }
        // Static background logic
        else {
            await this.changeBackgroundToIDInstant(this._bgCurrentIdSetting.value);
        }

        this._bgCycleSetting.subscribe((value) => {
            if(value) this.resumeCycling();
            else this.stopCycling();
        });
    }

    private constructor() {}

    /**
     * Converts stored interval value in MS depending
     * on the selected unit and returns it.
     */
    public storedIntervalMS ():number {
        switch (this._bgCycleIntervalUnitSetting.value) {
            case "sec":
                return this._bgCycleIntervalSetting.value * 1000;
            case "min":
                return this._bgCycleIntervalSetting.value * 60000;
            case "hr":
                return this._bgCycleIntervalSetting.value * 3600000;
            default:
                return 30000; // 30 seconds
        }
    }

    /**
     * Returns the ID of the next background in the selected list
     */
    private getNextIDSequencial ():string {
        let selectedBackgroundArray = 
            this._bgSelectedIdsSetting.value;
        let selectedBackgroundIndex = selectedBackgroundArray.indexOf(
            this._bgCurrentIdSetting.value
        );

        // Increments the selected index for it to point to the next background
        // At the same time preventing it to get out of bounds
        if(selectedBackgroundIndex + 1 >= selectedBackgroundArray.length) {
            selectedBackgroundIndex = 0;
        } else {
            selectedBackgroundIndex++;
        }

        return selectedBackgroundArray[selectedBackgroundIndex];
    }

    /**
     * Returns a random ID of a background in the selected list
     */
    private getNextIDRandom ():string {
        let selectedBackgroundArray = 
            this._bgSelectedIdsSetting.value;
        let backgroundCycleHistory = 
            this._bgIdsCycleHistorySetting.value;
    
        const random = () => Math.floor(
            Math.random() * selectedBackgroundArray.length
        );

        if (backgroundCycleHistory.length == 0 )
            return selectedBackgroundArray[random()];

        let rand = random();
        if(selectedBackgroundArray.length >= 3)
            while (backgroundCycleHistory.includes(
                selectedBackgroundArray[rand]
            )) rand = random();

        return selectedBackgroundArray[rand];
    }

    /** Gets the url pointing to a given background id
     * @param id ID of the targeted background
     */
    public static async idToBackground(id: string) {
        if(backgroundsJSON.includes(id)) {
            return {url: `backgrounds/${id}.jpg`, type:"image/jpg"};
        } else {
            const backgroundBlob = await BackgroundsManager.backgroundsBD.fetchBackground(id);
            return {url: URL.createObjectURL(backgroundBlob), type:backgroundBlob["type"]};
        }
    }

    /**
     * Changes the background to a given id and stores its id
     * in the background history.
     * @param {number} nextID Id of the targeted background.
     */
    public async changeBackgroundToID (nextID: string) {
        const bg = await BackgroundsManager.idToBackground(nextID);
        let url = bg.url;
        this.crossFade(url, bg.type);
        this._bgCurrentIdSetting.value = nextID;
        let cycleHistory = this._bgIdsCycleHistorySetting.value;
        cycleHistory.push(nextID);
        if (cycleHistory.length > 1) cycleHistory.shift();
        this._bgIdsCycleHistorySetting.value = cycleHistory;
    }

    /**
     * Changes the background to a given id. and stores its id
     * in the background history, the crossfade effect is not applied.
     * @param {number} nextID Id of the targeted background.
     */
    public async changeBackgroundToIDInstant (nextID: string) {
        const bg = await BackgroundsManager.idToBackground(nextID);
        let toUrl = bg.url;
        let trueType = bg.type;
        let type = trueType.includes("video") ? "video" : "img";


        $(`.cb.active`).removeClass("active");
        $(`#cb-${this.layerToChange}-${type}`).addClass("active");
        if(type == "video") 
            $(`#cb-${this.layerToChange}-${type}`).attr("type", trueType);

        $(`#cb-${this.layerToChange}-${type}`).attr("src", toUrl);


        this._bgCurrentIdSetting.value = nextID;
        let cycleHistory = this._bgIdsCycleHistorySetting.value;
        cycleHistory.push(nextID);
        if (cycleHistory.length > 1) cycleHistory.shift();
        this._bgIdsCycleHistorySetting.value = cycleHistory;
        this.changeLayer();
    }
    /**  Changes the layer to its opposite, if layer 1 then it will become 2 */
    private changeLayer () {
        this.layerToChange = this.layerToChange === 1 ? 2 : 1;
    }

    /**
     * Pauses the background cycling process
     */
    public stopCycling () {
        this._canCycle = false;
        if(this.interval) clearInterval(this.interval);
    }

    /**
     * Resumes the background cycling process
     */
    public resumeCycling () {
        this._canCycle = true;
        if(this.interval) clearInterval(this.interval);
        this.interval = setInterval(
            this.cycleBackground, this.storedIntervalMS()
        );
    }

    /**
     * Cross fades between two backgrounds
     */
    private crossFade (toUrl: string, trueType: string) {

        // Extracts the type of the target background, 
        // it will either be "video" or "img".
        let type = trueType.includes("video") ? "video" : "img";


        // Previous active background element 
        const prev = $(`.cb.active`);

        if(type == "video") 
            $(`#cb-${this.layerToChange}-${type}`).attr("type", trueType);
        
        $(`#cb-${this.layerToChange}-${type}`).attr("src", toUrl);

        $(`#cb-${this.layerToChange}-${type}`).addClass("new-active");

        // Removes the active class to the previous active background element to start the transition
        setTimeout(() => {
            $(`#cb-${this.layerToChange}-${type}`).removeClass("new-active");
            $(`#cb-${this.layerToChange}-${type}`).addClass("active");
            prev.removeClass("active");
            this.changeLayer();
        }, this.CROSSFADE_DURATION);
    }

    /** Returns the next background id according to settings
     * @return Next ID
     */
    public getNextID(): string { 
        return this._bgShuffleSetting.value ? 
        this.getNextIDRandom() : 
        this.getNextIDSequencial();
    }

    /**
     * Cycles backgrounds automatically according to user preferences
     */
    private cycleBackground = () => {
        if(this._canCycle) {
            this.changeBackgroundToID(this.getNextID());
        }
    }
}
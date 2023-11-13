import backgroundsJSON from "@Public/backgrounds/backgrounds.json"

jest.useFakeTimers();

const BackgroundsManager = () => {
    return require("../src/backgrounds/BackgroundsManager").default;
}

const appManager = () => {
    return require("../src/AppManager").default;
}

describe("Testing BackgroundsManager class", () => {
    const bgCycleIntervalSetting = appManager()
        .getSetting("background-cycle-interval-integer");

    const bgCycleIntervalUnitSetting = appManager()
        .getSetting("background-cycle-interval-unit-string");

    const bgSelectedIdsSetting = appManager()
        .getSetting("background-id-selected-array");

    const bgCurrentIdSetting = appManager()
        .getSetting("background-id-current-integer");

    const bgIdsCycleHistorySetting = appManager()
        .getSetting("background-id-cycle-history-array");
        
    const bgCycleSetting = appManager()
        .getSetting("background-cycle-boolean");
        
    const bgShuffleSetting = appManager()
        .getSetting("background-shuffle-boolean" );

    beforeAll(async () => {
        await BackgroundsManager().instance.init();
    })

    test("Getting all IDs", async () => {
        expect(
            await BackgroundsManager().getBackgroundsIDs()
        ).toStrictEqual(["a","b","c","d"]);
    });
    
    test("Getting background count", async () => {
        expect(
            await BackgroundsManager().getBackgroundsCount()
        ).toBe(backgroundsJSON.length);
    });

    test("Changing interval", () => {
        bgCycleIntervalSetting.value = 5;
        expect(
            BackgroundsManager().instance.storedIntervalMS()
        ).toBe(5000);
        bgCycleIntervalUnitSetting.value = "min";
        expect(
            BackgroundsManager().instance.storedIntervalMS()
        ).toBe(300000);
        bgCycleIntervalUnitSetting.value = "hr";
        expect(
            BackgroundsManager().instance.storedIntervalMS()
        ).toBe(18000000);
        bgCycleIntervalUnitSetting.value = "";
        expect(
            BackgroundsManager().instance.storedIntervalMS()
        ).toBe(30000);
    });

    test("Getting next background sequencial", async () => {
        await BackgroundsManager().instance.changeBackgroundToID("a");
        bgShuffleSetting.value = false;
        expect(
            await BackgroundsManager().instance.getNextID()
        ).toBe("b");
        
        // Edge case
        await BackgroundsManager().instance.changeBackgroundToID(
            (await BackgroundsManager().getBackgroundsIDs())
            [(await BackgroundsManager().getBackgroundsIDs()).length-1]
        );
        await BackgroundsManager().instance.getNextID();
        expect(
            await BackgroundsManager().instance.getNextID()
        ).toBe("a");
    })

    test("Getting next background random", async () => {
        bgShuffleSetting.value = true;
        expect(
            (await BackgroundsManager().getBackgroundsIDs()).includes(
               (await BackgroundsManager().instance.getNextID())
            )
        ).toBe(true);

        // Edge case
        bgShuffleSetting.value = true;
        let temp = await BackgroundsManager().getBackgroundsIDs();
        temp.pop();
        bgIdsCycleHistorySetting.value = temp;
        expect(
            await BackgroundsManager().instance.getNextID()
        ).toBe((await BackgroundsManager().getBackgroundsIDs())
            [(await BackgroundsManager().getBackgroundsIDs()).length-1]
        );
    })

    test("Changing background", async () => {
        bgShuffleSetting.value = false;
        await BackgroundsManager().instance.changeBackgroundToID("a");
        jest.runOnlyPendingTimers();

        expect(
            await BackgroundsManager().instance.getNextID()
        ).toBe("b");
    })

    test("Stop cycle", async () => {
        bgShuffleSetting.value = false;
        bgCycleSetting.value = true;
        await BackgroundsManager().instance.changeBackgroundToID("a");
        BackgroundsManager().instance.stopCycling();
        jest.runOnlyPendingTimers();

        expect(
            bgCurrentIdSetting.value
        ).toBe("a");
    })

    test("Resume cycle", () => {
        bgShuffleSetting.value = false;
        bgCycleSetting.value = true;
        BackgroundsManager().instance.changeBackgroundToID("a");
        BackgroundsManager().instance.stopCycling();
        jest.runOnlyPendingTimers();

        expect(
            bgCurrentIdSetting.value
        ).toBe("a");

        BackgroundsManager().instance.resumeCycling();
        jest.runOnlyPendingTimers();

        expect(
            bgCurrentIdSetting.value
        ).toBe("a");
    })

    test("Fixed Background", async () => {
        bgCycleSetting.value = false;
        bgCurrentIdSetting.value = "a";
        await BackgroundsManager().instance.init();
        
        jest.runOnlyPendingTimers();

        expect(
            bgCurrentIdSetting.value
        ).toBe("a");
    })

})
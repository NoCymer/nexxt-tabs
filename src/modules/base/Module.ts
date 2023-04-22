import { SettingsManager } from "@Settings/SettingsManager";
import { Setting } from "@Settings/Setting";
import i18n from '@Public/i18n/config';
import React from "react";

/**
 * Module manager used to manage a module by operations such as getting/setting
 * module settings and enabling/disabling it.  
 */
export class Module extends SettingsManager{
    /** Setting of the module"s state */
    private _enabledSetting: Setting<boolean>;

    /** Name of the module */
    private _name = "";

    /** Title of the module */
    private _title = "";

    /** Description of the module */
    private _desc = "";

    /** Url of the module"s image */
    private _iconURL = "";

    /** Called when module is enabled */
    private _onEnable: Function;

    /** Called when module is disabled */
    private _onDisable: Function;

    /** Section element of the module"s settings  */
    private _settingsSectionElement: React.ReactNode;

    /** Root element of the module */
    private _rootElement: React.ReactNode;
    
    private _isEnabled: boolean;

    public get onEnable() {
        return this._onEnable;
    }

    public set onEnable(value) {
        this._onEnable = value;
    }

    public get onDisable() {
        return this._onDisable;
    }

    public set onDisable(value) {
        this._onDisable = value;
    }

    public get rootElement(): React.ReactNode {
        return this._rootElement;
    }

    public set rootElement(value: React.ReactNode) {
        this._rootElement = value;
    }
    
    public get settingsSectionElement(): React.ReactNode {
        return this._settingsSectionElement;
    }

    public set settingsSectionElement(value: React.ReactNode) {
        this._settingsSectionElement = value;
    }

    public get enabledSetting(): Setting<boolean> {
        return this._enabledSetting;
    }

    /** Checks if the module is enabled */
    public isEnabled():boolean {
        return this._enabledSetting.value;
    }

    /** Enables the module */
    public enable():void {
        if (!this._isEnabled) {
            this._isEnabled = true;
            if(!this._enabledSetting.value) this._enabledSetting.value = true;
            this.onEnable(this);
        }
    }

    /** Disables the module */
    public disable():void {
        if (this._isEnabled) {
            this._isEnabled = false;
            if(this._enabledSetting.value) this._enabledSetting.value = false;
            this.onDisable(this);
        }
    }

    public get name() {
        return this._name;
    }

    public get title() {
        return this._title;
    }

    public get desc() {
        return this._desc;
    }

    public get iconURL() {
        return this._iconURL;
    }

    /** Creates the instance of the singleton pattern
     * @param moduleJSON JSON that contains all of the module's infos
     * to the module
     * @param onEnable Callback called when module is enabled
     * @param onDisable Callback called when module is disabled
     */
    public constructor(
        moduleJSON: Object,
        onEnable: (module?: Module) => void = () => {},
        onDisable: (module?: Module) => void = () => {}) {      
        super(moduleJSON["settings"]);
        
        // Checks if the module is translatable
        if(moduleJSON.hasOwnProperty("supported-languages")) {
            if (moduleJSON["supported-languages"] === "inherit"){
                i18n.languages.forEach((language) => {
                    const translation = 
                        require(`../${moduleJSON["name"]}/` +
                        `locales/${language}/translations.json`);
                        i18n.addResourceBundle(
                        language,
                        "translations",
                        translation
                    );
                })
            }
            else {
                moduleJSON["supported-languages"].forEach(
                    (language: string) => {     

                    const translation = 
                        require(`../${moduleJSON["name"]}/` +
                        `locales/${language}/translations.json`);
                        i18n.addResourceBundle(
                        language,
                        "translations",
                        translation
                    );
                });
            }
        }
        this._enabledSetting = new Setting(
            moduleJSON["status-setting"]["key"],
            moduleJSON["status-setting"]["defaultValue"]
        );

        this._name = moduleJSON["name"];
        this._title = moduleJSON["title"];
        this._desc = moduleJSON["desc"];
        this._iconURL = moduleJSON["iconURL"];

        this.onEnable = onEnable;
        this.onDisable = onDisable;

        this._isEnabled = this._enabledSetting.value;

        if(this._enabledSetting.value) this.onEnable(this);

        this._enabledSetting.subscribe((val) => {
            val ? this.enable() : this.disable();
        })
    }
}

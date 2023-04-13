import { Setting } from "./Setting"

/**
 * Manages multiple setting
 */
export class SettingsManager{
    protected _settings: Setting<any>[] = [];

    /** Creates a new SettingsManager */
    public constructor(settingsJSON: {}) {
        this.loadSettings(settingsJSON);
    }

    /**
     * Gets a setting from the settingsManager
     * @param settingName Name of the setting as specified in the 
     * settings.json file
     * @returns Setting object 
     */
    public getSetting(settingName: string):Setting<any> {
        let setting = this._settings.find(
            value => value.storageKey == settingName
        );
        if(!setting) throw new Error("Setting does not exist");
        return setting;
    }

    /**
     * Creates a setting, can be overridden to add extra rules to setting 
     * creation
     * @param key Key of the setting
     * @param defaultValue Default Value of the setting
     * @returns New Setting
     */
    protected createSetting(key: string, defaultValue: string): Setting<any> {
        return new Setting(key, defaultValue);
    }

    /**
     * Loads the settings from the settings.json file and stores it in the
     * singleton
     */
    private loadSettings(settingsJson: Object) {
        for(let setting in settingsJson) { 
            this._settings.push(
                this.createSetting(
                    setting,settingsJson[setting]["defaultValue"]
                )
            );
        }
    }
}

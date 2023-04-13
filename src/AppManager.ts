import {languages} from "../public/i18n/config";
import { SettingsManager } from "./settings/SettingsManager";
import { Setting } from "./settings/Setting";
import settingsFileJson from "./settings.json"
import backgroundsJSON from "../public/backgrounds/backgrounds.json"

/**
 * Manages the app's main settings 
 */
class AppManager extends SettingsManager{

    constructor() {
        super(settingsFileJson);
    }

    protected createSetting(key: string, defaultValue: string): Setting<any> {
        let newSetting: Setting<any>;
        switch(key) {
            case "language-string":
                newSetting = new Setting(
                    key,
                    languages.includes(
                        navigator.language.split("-")[0]
                    ) ? navigator.language.split("-")[0] : "en"
                );
                break;
            case "background-id-selected-array":
                newSetting = new Setting(
                    key, backgroundsJSON
                );
                break;
            default:
                newSetting = new Setting(key, defaultValue);
                break;
        }
        return newSetting;
    }

}
const appManager = new AppManager();

export default appManager;
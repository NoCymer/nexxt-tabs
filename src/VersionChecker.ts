import manifest from "@Public/manifest.json"
import appManager from "./AppManager"

/**
 * Class used to check the client's version of the extension
 */
export default class VersionChecker {
    /** Setting containing the last version of the client */
    private static _previousVersion = appManager.getSetting(
        "last-version-showcased-string"
    );
    /**
     * Checks if the client has just undergo an update
     * @returns True if the client just updated
     */
    public static hasUpdated = () => {
        let hasUpdated = manifest.version != this._previousVersion.value;
        if(hasUpdated && this._previousVersion.value === "none") {
            hasUpdated = false;
        }
        this._previousVersion.value = manifest.version;
        return hasUpdated;
    }
    /**
     * Returns the extension's version
     * @returns Extension's version
     */
    public static getVersion = () => {
        return manifest.version;
    }
    /**
     * Fetches and retuns the JSON File containing the patch note of the update
     * @returns JSON containing the patch note
     */
    public static getUpdateJSON = async () => {
        
        return (await fetch(
            `patch-notes/${this.getVersion()}-patch-notes.json`
        )).json();
    }
}
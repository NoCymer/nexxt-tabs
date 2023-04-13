import UserStorage, { StorageKey } from "../UserStorage";

/**
 * Setting which is linked to a key from the browser"s localStorage, which works 
 * as an interface between the app and the storage.
 */
export class Setting<T> extends UserStorage<T>{
    /**
     * Setting class allowing manipulating its value and subscribing to it 
     * @param storageKey Key refering to the browser"s local storage"s key
     * @param defaultValue Default value that will be assigned to the setting
     * if none is already stored
     */
    constructor(storageKey: StorageKey, defaultValue: T) {
        super(storageKey, defaultValue);
    }
}
export type StorageKey = number | String;

/**
 * Allows to store and retrieve dynamically any type of data
 * in the web browser"s local storage.
*/
export default class UserStorage<T>{
    private _storageKey: StorageKey;
    private _value: T;
    private _onChangeEvent: Function[];

    /**
     * Creates a new UserStorage Object which allows to store and retrieve 
     * dynamically any type of data in/from the web browser"s local storage.
     * @param storageKey - Storage Key corresponting to the 
     * browser"s local storage access key.
     * @param defaultValue - Default value of the storage.
     * @return Returns created UserStorage.
     */
    constructor(storageKey: StorageKey, defaultValue: T){
        if (defaultValue == undefined) 
            throw new Error("Default value must not be undefined") ;
        this._onChangeEvent = [];
        this._storageKey = storageKey;
        let temp = localStorage.getItem(`${this._storageKey}`);
        if(temp && temp != "undefined" && temp != "null") {
            this._value = JSON.parse(temp);
            this.value = this._value;
        }
        else {
            localStorage.setItem(
                `${this._storageKey}`, JSON.stringify(defaultValue)
            );
        }
        return this;
    }

    /**
     * Stores a new value
     * @param newValue - New value.
     */
    set value(newValue: T) {
        this._value = newValue;
        localStorage.setItem(
            `${this._storageKey}`, JSON.stringify(this._value)
        ); 
    
        //Invoke each callback in the callback list
        if (this._onChangeEvent.length > 0) {
            this._onChangeEvent.forEach(callback => {
                callback(this.value);
            });
        }
    }
    
    /**
     * Gets the value.
     * @return Returns currently stored value.
     */
    get value(): T {
        let temp = localStorage.getItem(`${this._storageKey}`);
        if (temp != null) this._value = JSON.parse(temp);
        return this._value;
    }

    /** Returns the storage key corresponding to the browser"s localStorage */
    public get storageKey(): StorageKey {
        return this._storageKey;
    }

    /**
     * Subscribes a callback to the value, which will be invoked when the value
     * changes.
     * @param {(newValue: any) => {}} callback Callback, the new value is passed
     * as an argument.
     */
    subscribe(callback: (newValue: any) => any) {
        this._onChangeEvent.push(callback);
    }
}
import { Setting } from '@Settings/Setting';
import { useEffect, useState } from "react";

/**
 * Returns a value and a function to update it
 * The value is linked to a setting and updates when the setting
 * value changes
 * @param setting Target setting
 * @returns [ settingValue, settingValueSetter ]
 */
export const useSetting = <T>(setting: Setting<T>, callback?:(newValue:T)=>void) => {
    const [value, setValue] = useState(setting.value);

    useEffect(() => {
        setting.subscribe((value) => {
            setValue(value);
            callback && callback(value);
        });
    }, []);

    const valueSetter = (value: T) => {
        setting.value = value;
    }

    return [value, valueSetter] as const;
}
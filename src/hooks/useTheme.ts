import { Setting } from '@Settings/Setting';
import { useSetting } from './useSetting';
import appManager from '../AppManager';
import { useEffect, useState } from 'react';

/**
 * Theme selector hook
 * @returns [value, valueSetter]
 */
export const useTheme = () => {
    const setting = appManager.getSetting("user-theme")
    const [value, setValue] = useState(setting.value);

    useEffect(() => {
        setting.subscribe((value) => {
            setValue(value);
        });
    }, []);

    const valueSetter = (value) => {
        setting.value = value;
    }

    return [value, valueSetter] as const;
}
import React, { useEffect, useState } from "react";
import { Setting } from "Settings/";
import { useSetting } from "../../hooks";

interface IInlineChoice {
    value: string
    text: string
    setting?: Setting<any>
}

export interface IInlineChoiceContainer {
    setting: Setting<any>
    children: any
    callback?: Function
}


export const InlineChoiceContainer = (
    {setting, children, callback}:IInlineChoiceContainer
    ) => {

    useEffect(() => {
        setting.subscribe((e) => {
            if (callback) callback(e);
        })
    },[])
    return(
        <div
            className="inline-multiple-selector"
            id="weekday-multiple-selector"
            aria-label="choices"
        >
            { children.map(
                (choice) => React.cloneElement(choice, {setting: setting})
            )}
        </div>
    )
}

export const InlineChoice = ({value, text, setting}: IInlineChoice) => {
    const [activeValue, setActiveValue] = useSetting(setting);
    return(
        <div 
            className={
                `multiple-selector-entry ${
                    (activeValue == value) ? "active" : ""
                }`
            }
            data-value={value}
            onClick={() => setActiveValue(value)}
        >
            {text}
        </div>
    )
}


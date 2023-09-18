import React, { useEffect, useState } from "react";
import { Setting } from "@Settings/Setting";
import { useSetting } from "@Hooks/useSetting";

interface IInlineChoice {
    value: string
    text: string
    className?: string
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

export const InlineChoice = ({value, text, setting, className}: IInlineChoice) => {
    const [activeValue, setActiveValue] = useSetting(setting);
    return(
        <div 
            className={
                `multiple-selector-entry ${
                    (activeValue == value) ? "active" : ""
                } ${className}`
            }
            data-value={value}
            onClick={() => setActiveValue(value)}
        >
            {text}
        </div>
    )
}


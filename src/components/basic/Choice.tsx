import React, { useEffect, useState } from "react";
import { Setting } from "Settings/";

interface IChoice {
    value: string
    setting ?: Setting<string|number>
    text: string
    img?: string
    activeImg?: string
}

interface IChoices {
    setting: Setting<string>
    children: any
    callback?: Function
}

/**
 * Choice component, child of a Choices component stores its own value and 
 * gets selected when clicked then stores the new value into the browser.
 * @param value Value of the Choice component, the value must be unique 
 * @param text Text displayed on the Choice component
 * @param img Choice component"s image"s source
 * @param activeImg Choice component"s image"s source
 */
const Choice = ({setting, value, text, img, activeImg}: IChoice) => {
    const [active, setActive] = useState(setting.value == value);
    useEffect(() => {
        setting.subscribe((newValue) => {
            setActive(newValue == value);
        })
    },[]);
    
    const handleClick = () => {
        setting.value = value;
    }
    return (
        <div 
            aria-label="choice"
            className={`side-Panel-select-option ${active ? "active" : ""}`}
            id={value}
            data-value={value}
            onClick={handleClick}
        >
            {
                img &&
                <img src={`${active ? (activeImg ? activeImg : img) : img}`}/>
            }
            <p>{text}</p>
        </div>
    );
}

/**
 * Dynamically switch between multiple choice.
 * @param {string | number} setting 
 */
const ChoiceContainer = ({setting, children, callback}: IChoices) => {
    useEffect(() => {
        setting.subscribe((e) => {
            if (callback) callback(e);
        })
    },[])
    return (
        <div aria-label="choices" className="side-Panel-option-list">
            { children.map(
                (choice) => React.cloneElement(choice, {setting: setting})
            )}
        </div>
    );
}

export {Choice, ChoiceContainer};
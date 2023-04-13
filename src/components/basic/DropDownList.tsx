import React, { ChangeEvent, useState } from "react";

export interface IDropDownList {
    options: {content: string, value: string}[];
    selectedValue: string;
    onChange?: (value ?: string) => {}
}

/**
 * Simple drop down list
 * @param options List of possible value-content pairs
 * @param selectedValue Value selected by default
 * @param callback Callback called when the value changes
 * @returns
 */
const DropDownList = ({options, selectedValue, onChange}: IDropDownList) => {
    const [value, setValue] = useState(selectedValue);

    const handleChange = (e: ChangeEvent) => {
        const newValue = (e.target as HTMLSelectElement).value;
        setValue(newValue);
        onChange && onChange(newValue);
    } 

    return (
        <select
            className="drop-down-list"
            value={value}
            onChange={handleChange}
        >
            {options.map((option) => {
                return <option value={option.value} key={option.value}>
                    {option.content}
                </option>
            })}
        </select>
    )
}

export default DropDownList;
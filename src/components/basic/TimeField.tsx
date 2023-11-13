import React, { FormEvent, useState } from "react";

export interface ITimeField {
    onInput?: (newValue?: string) => void
    defaultValue?: string
}

/**
 * Input field containing only datetime 
 * @param onInput Callback called with ne new value as the first parameter when
 * the input value changes
 * @param defaultValue Value that the input has by default
 */
const TimeField = ({
        onInput,
        defaultValue = "00:00"
    }: ITimeField) => {
        
    const [value, setValue] = useState(defaultValue);

    const handleInput = (event: FormEvent) => {
        let newValue = (event.target as HTMLInputElement).value;
        setValue(newValue);
        onInput && onInput(newValue);
    }

    return (
        <input
            className="input-field"
            type="time"
            onInput={handleInput}
            value={value}
        />
    )
}

export default TimeField;
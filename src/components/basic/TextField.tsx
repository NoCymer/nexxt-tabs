import React, { FormEvent, useState } from "react";

export interface ITextField {
    onInput?: (newValue?: string) => void
    defaultValue?: string
    placeholder?: string
}

/**
 * Input field containing only text 
 * @param onInput Callback called with ne new value as the first parameter when
 * the input value changes
 * @param defaultValue Value that the input has by default
 */
const TextField = ({
        onInput,
        defaultValue = "",
        placeholder = ""
    }: ITextField) => {

    const [value, setValue] = useState(defaultValue);

    const handleInput = (event: FormEvent) => {
        let newValue = (event.target as HTMLInputElement).value;
        setValue(newValue);
        onInput && onInput(newValue);1
    }

    return (
        <input
            className="input-field"
            type="text"
            onInput={handleInput}
            placeholder={placeholder}
            value={value}
        />
    )
}

export default TextField;
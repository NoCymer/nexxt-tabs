import React, { FormEvent, useState } from "react";

export interface IDateTimeField {
    onInput?: (newValue?: number) => void
    defaultValue?: Date
}

/**
 * Input field containing only datetime 
 * @param onInput Callback called with ne new value as the first parameter when
 * the input value changes
 * @param defaultValue Value that the input has by default
 */
const DateTimeField = ({
        onInput,
        defaultValue = new Date(Date.now())
    }: IDateTimeField) => {
        
    const [value, setValue] = useState(defaultValue);

    const handleInput = (event: FormEvent) => {
        let newValue = new Date((event.target as HTMLInputElement).value);
        setValue(newValue);
        onInput && onInput(newValue.getTime());
    }

    const ISOtoValue = (ISO: string) => {
        return ISO.substring(0,19);
    } 

    return (
        <input
            className="input-field"
            type="datetime-local"
            onInput={handleInput}
            value={ISOtoValue(value.toISOString())}
        />
    )
}

export default DateTimeField;
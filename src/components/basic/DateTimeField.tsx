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

    const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    } 

    return (
        <input
            className="input-field"
            type="date"
            onInput={handleInput}
            value={formatDate(value)}
        />
    )
}

export default DateTimeField;
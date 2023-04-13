import React, { FormEvent, useState } from "react";

export interface INumberField {
    onInput?: (newValue?: number) => void
    defaultValue?: number
    minValue?: number
}

/**
 * Input field containing only numbers 
 * @param onInput Callback called with ne new value as the first parameter when
 * the input value changes
 * @param defaultValue Value that the input has by default
 * @param minValue Value that the input cannot go under
 */
const NumberField = ({
        onInput,
        defaultValue = 1,
        minValue = 1
    }: INumberField) => {
        
    // Verifying if default value isn't inferior to the minimum value
    defaultValue = defaultValue >= minValue ? defaultValue : minValue

    const [value, setValue] = useState(defaultValue);

    const handleInput = (event: FormEvent) => {
        let newValue = Number.parseInt(
            (event.target as HTMLInputElement).value
        );
        //Checking that the new value isn't null
        newValue = !Number.isNaN(newValue) ? newValue : minValue;

        //Checking that the new value isn't inferior to the min value
        newValue = newValue > minValue ? newValue : minValue;

        setValue(newValue);
        onInput && onInput(newValue);1
    }

    return (
        <input
            className="input-field"
            type="number"
            min={minValue}
            onInput={handleInput}
            value={value}
        />
    )
}

export default NumberField;
import { useSetting } from "@Hooks/useSetting";
import { Setting } from "@Settings/Setting";
import React from "react"

interface IValueSlider {
    setting: Setting<any>;
    max: number;
    min: number;
    step: number;
    title: string;
    minValName: string;
    maxValName: string;
}

const ValueSlider = ({setting, title,max, min, step, minValName, maxValName}: IValueSlider) => {
    const [value, setValue] = useSetting(setting);

    const onChange = (e) => setValue(e.target.value);
    
    return (
        <div className="value-slider">
            <h2>{title}</h2>
            <input type="range" min={min} max={max} step={step} name="" id="" onChange={onChange} value={value}/>
            <span className="min-val-name">{minValName}</span>
            <span className="max-val-name">{maxValName}</span>
        </div>
    )
}

export default ValueSlider
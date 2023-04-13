import React, { ChangeEvent, useEffect, useState } from "react";

interface ISwitch{
    type: string
    isActive: boolean
    onChange?: (isActive: boolean, event: ChangeEvent) => void
    changeChecker?: () => boolean
}

export interface ISwitchDerivative {
    isActive: boolean
    onChange?: (isActive: boolean, event: ChangeEvent) => void
    changeChecker?: () => boolean
}

/**
 * Basic Switch component which can be either active 
 * or inactive.
 * NB : If no onChange function is provided, nothing will happen when clicked 
 * @param type Type of the switch either slider or checkbox
 * @param isActive Whether or not the slider is active
 * @param onChange Callback called when switch's value changes
 * @param changeChecker Function checkinf if the Switch can or cannot change
 * its value
 */
const Switch = ({type, isActive, onChange, changeChecker}: ISwitch) => {
    const [active, setActive] = useState(isActive);

    useEffect(() => setActive(isActive), [isActive]);

    return(
        <div className={`${type}-container`}>
            <label className={`${type}`}>
                <input 
                    aria-label="switch-setting"
                    type="checkbox"
                    checked={active}
                    onChange={(event: ChangeEvent) => {
                        if(changeChecker) {
                            if(changeChecker()) {
                                onChange && setActive(!active);
                                onChange && onChange(!active, event);
                            }
                        } else {
                            onChange && setActive(!active);
                            onChange && onChange(!active, event);
                        }
                    }}
                /> 
                <span/>
            </label>
        </div>
    )
}

export default Switch;
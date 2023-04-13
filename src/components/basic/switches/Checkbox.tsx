import React, { ChangeEvent, useEffect, useState } from "react";
import { Setting } from "Settings/";
import Switch, { ISwitchDerivative } from "./Switch";

/**
 * Basic checkbox deriving from the Switch component which can be either active 
 * or inactive.
 * NB : If no onChange function is provided, nothing will happen when clicked 
 * @param isActive Whether or not the checkbox is active
 * @param onChange Callback called when the value changes
 * @param changeChecker Function checkinf if the Switch can or cannot change
 * its value
 */
const Checkbox = ({isActive, onChange, changeChecker}: ISwitchDerivative) => {
    return(
        <Switch
            isActive={isActive}
            onChange={onChange}
            changeChecker={changeChecker}
            type="checkbox"
        />
    )
}

export default Checkbox;
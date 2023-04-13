import React from "react";

interface IButtonOptions {
    fillMode: ("filled" | "outlined");
    color: ("primary" | "danger" | "success");
}

interface IButton {
    callback: ((e ?: any) => void) | Function;
    options: IButtonOptions;
    formAction?: string;
    type?: "button" | "submit" | "reset";
    children: any;
}

/**
 * @param callback Callback invoked when the button is clicked.
 * @param options Button's styling options
 */
const Button = ({callback, options,formAction, children, type }: IButton) => {
    const getClassName = () => {
        let className = "button ";
        className += options.color;
        if(options.fillMode === "filled") {
            className += " filled";
        }
        return className;
    }
    return (
        <button 
            aria-label="button"  
            className={getClassName()}
            onClick={(e) => callback(e)}
            formAction={formAction}
            type={type}
        >
            {children}
        </button>
    )
}


interface IButtonContainer {
    direction: ("stacked" | "inline");
    fitMode?: "fit";
    children: any;
}
/**
 * Contains at least one or more Button components, used as a styling wrapper.
 * @param {("stacked" | "inline")} direction Determines if the buttons are
 *  stacked or inline.
 * @param {("fit")} [fitMode] Optional parameter, makes the buttons take 100% 
 * of the available width.
 */
const ButtonContainer = ({direction, fitMode, children}: IButtonContainer) => {
    const getClassName = () => `button-wrapper ${direction} ${fitMode}`;
    return( 
        <div aria-label="button-container" className={getClassName()}>
            {children} 
        </div>
    )
}

export  {Button, ButtonContainer};

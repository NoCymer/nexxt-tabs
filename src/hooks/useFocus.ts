import React, { useEffect } from 'react'
import $ from "jquery";

/**
 * Checks if the click is inside of a popup
 * @param event Mouse click event
 * @returns True if the click is inside a popup, else returns false
 */
const isPopupClicked = (event: MouseEvent):boolean => {
    let popups = $(".popup");
    let popupContainers = $(".popup-container");
    let hasClickedPopup = false;
    popups.each((i, popup) => {
        if($.contains(popup, <HTMLElement>event.target))
            hasClickedPopup = true;
    })
    if(!hasClickedPopup)
        popupContainers.each((i, popup) => {
            if(
                $(popup).is(<HTMLElement>event.target) || 
                $.contains(popup, <HTMLElement>event.target)
            )
                hasClickedPopup = true;
        })
    return hasClickedPopup;
}

/**
 * Calls the provided callback when a click event happens outside of the 
 * provided references, NB: Popups doesn't trigger the closing event
 * @param focusedRefs Array of references
 * @param onClickedOutside Called when clicked outside of component
 */
export const useFocus = (
    focusedRefs: React.RefObject<any>[],
    onClickedOutside: Function) => {

    useEffect(() => {
        // Function for click event
        const handleOutsideClick = (event: MouseEvent) => {

            let hasClickedOutside = true;
            focusedRefs.forEach((focusedRef) => {
                if(
                    focusedRef.current &&
                    (
                        focusedRef.current.contains(event.target) ||
                        isPopupClicked(event)
                    )
                ) hasClickedOutside = false;
            })
            onClickedOutside && hasClickedOutside && onClickedOutside();
        }
        // Adding click event listener
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);
}
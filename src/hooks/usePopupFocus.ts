import React, { useEffect } from 'react'

/**
 * Calls the provided callback when a click event happens outside of the 
 * provided references USED EXCLUSIVELY FOR POPUPS
 * @param focusedRefs Array of references
 * @param onClickedOutside Called when clicked outside of component
 */
export const usePopupFocus = (
    focusedRefs: React.RefObject<any>[],
    onClickedOutside: Function) => {

    useEffect(() => {
        // Function for click event
        const handleOutsideClick = (event: MouseEvent) => {

            let hasClickedOutside = true;
            focusedRefs.forEach((focusedRef) => {
                if(focusedRef && focusedRef.current) {
                    if(
                        focusedRef.current &&
                        (
                            focusedRef.current.contains(event.target)
                        )
                    ) hasClickedOutside = false;
                }
            })
            onClickedOutside && hasClickedOutside && onClickedOutside();
        }
        // Adding click event listener
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);
}
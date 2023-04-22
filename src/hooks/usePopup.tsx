import React, { ReactNode, useEffect, useState } from "react";
import $ from "jquery";
import { createRoot, Root } from "react-dom/client";
import { IPopup } from "@Components/advanced/Popup";
import { useTransition, animated } from "@react-spring/web";
import { useTranslation } from "react-i18next";

// Initializing popup system
const popupTarget = $("#popup-target");
let popupRoot: Root;

if (popupTarget && popupTarget.get(0)) {
    popupRoot = createRoot(popupTarget.get(0));
} 

// Array containing all the popups's React Node
let popupsArray:React.ReactElement<IPopup>[] = [];

// Automatic keying for popups
let currentKey = 0;

/**
 * Contains all popups
 * @param popupsArray Array of popups's React Node
 */
const PopupContainer = ({popupsArray}) => {
    const [popups, setPopups] = useState<ReactNode[]>(popupsArray);

    const transition = useTransition(popups, {
        config: {
            duration: 100
        },
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },  
    });

    useEffect(() => {
        setPopups(popupsArray);
    }, [popupsArray]);

    return transition((style, item) => (
        <animated.div style={style}>{item}</animated.div>
    ))
    
}

/**
 * Creates a popup, returns if it is displayed and a function to display or 
 * hide it
 * @param PopupNode Popup element
 * @param defaultVisibility Default visibility of the popup
 * @returns Popup's displayed state and a function to change it
 *  [visibility, setVisibility] 
 */
export const usePopup = (
        PopupNode:React.ReactElement<IPopup>,
        defaultVisibility = false
    ) => {
    const [isPopupVisible, setIsPopupVisible] = useState(defaultVisibility);
    const [key, setKey] = useState(++currentKey);
    const [popup, setPopup] = useState<React.ReactElement<IPopup>>(
        React.cloneElement(
            PopupNode, {visible: isPopupVisible, key:key}
        )
    );
    
    const {t} = useTranslation();

    // Updates the popup when app's language chaneges
    useEffect(() => {
        setPopup(React.cloneElement(
            PopupNode, {visible: isPopupVisible, key:key}
        ))
    }, [t])

    useEffect(() => {
        // Displays the popup in the DOM
        if(isPopupVisible) {
            //Creates the new popup's React Node
            const popupUpdate = React.cloneElement(
                popup, {visible: true, key:key}
            );

            // Append the popup to the popup array
            setPopup(popupUpdate);
            popupsArray.push(popupUpdate);

            // Updates the DOM to display the popup
            if (popupRoot) 
                popupRoot.render(
                    React.createElement(
                        PopupContainer,
                        {popupsArray: popupsArray}
                    )
                );
        }
        // Destroys the popup in the DOM
        else{
            // Removes the popup from the popups list
            popupsArray = popupsArray.filter(
                (entry) => entry.key != popup.key
            );
            // Updates the DOM to destroy the popup
            if (popupRoot) 
                popupRoot.render(
                    React.createElement(
                        PopupContainer,
                        {popupsArray: popupsArray}
                    )
                );
        }
    }, [isPopupVisible]);

    return [isPopupVisible, setIsPopupVisible] as const;
}
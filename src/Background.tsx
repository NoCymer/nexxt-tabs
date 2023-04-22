import Checkbox from "@Components/basic/switches/Checkbox"
import React, { useEffect, useState } from "react"
import backgroundsDB from "./BackgroundsDatabase"
import BackgroundsManager from "./BackgroundsManager"
import backgroundsJSON from "@Public/backgrounds/backgrounds.json"
import { Setting } from "@Settings/Setting"
import appManager from "./AppManager"
import { useSetting } from "@Hooks/useSetting"

interface IBackground {
    backgroundID: string
    backgroundURL: string
    selectedBackgroundsSetting?: Setting<string[]>
}

const bgIDsArraySetting = appManager
        .getSetting("background-ids-array");

const selectedBackgroundsSetting: Setting<string[]> = appManager
        .getSetting("background-id-selected-array");

/**
 * Sorts an array of string withou mutating it,
 * strings will end up at at the start of the array and
 * numbers stored as string will end up at the end of the array
 * @param array Array to sort
 * @returns Sorted array
 */
const sortStringArray = (array: string[]) => {
    let temp = array;
    temp.sort(function (a: string, b: string) { 
        if(!isNaN(Number(a)) && !isNaN(Number(b))) {
            return Number(a) - Number(b); 
        }
        if(!isNaN(Number(a)) || !isNaN(Number(b))) {
            return -(a).localeCompare(b); 
        }
        return (a).localeCompare(b); 
    });
    return temp;
}

/**
 * Adds an element to the given array without mutating it
 * @param array Target array
 * @param element Element to add
 * @returns Mutated array
 */
const addToArray = <T,>(array: T[], element: T) => {
    let temp = array;
    temp.push(element);
    return temp
}

/**
 * Removes an element from the given array without mutating it
 * @param array Target array
 * @param element Element to remove
 * @returns Mutated array
 */
const removeFromArray = <T,>(array: T[], element: T) => {
    let temp = array;
    temp = temp.filter(el => el !== element);
    return temp;
}

/**
 * Represents a selectable background that is linked to the
 * selectedBackgroundsSetting.
 */
const Background = ({
    backgroundID,
    backgroundURL,
    }: IBackground) => {

    const [selected, setSelected] = useState<boolean>(
        selectedBackgroundsSetting.value.includes(backgroundID)
    );

    useSetting(
        selectedBackgroundsSetting, 
        value => setSelected(value.includes(backgroundID))
    );

    const [isSingleSelectionInactive] = useSetting(
        appManager.getSetting("background-cycle-boolean")
    );

    const [activeBackground, setActiveBackground] = useSetting(
        appManager.getSetting("background-id-current-integer")
    );

    // Style of the background
    const backgroundStyle = {
        backgroundImage: `url(${backgroundURL})`,
        transitionDelay: "0s",
        opacity: "1"
    }

    /**
     * Handles the deletion of the background, removes it from the selected
     * backgrounds and sorts the list
     * @param e Event
     */
    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await backgroundsDB.deleteBackground(backgroundID);

        //Removes the background from the selected backgrounds list
        selectedBackgroundsSetting.value = sortStringArray(
            removeFromArray(selectedBackgroundsSetting.value, backgroundID)
        );

        //Removes the background from the backgrounds list
        bgIDsArraySetting.value = sortStringArray(
            removeFromArray(bgIDsArraySetting.value, backgroundID)
        );

        // Prevents having empty array of selected backgrounds
        if(selectedBackgroundsSetting.value.length === 0) {
            selectedBackgroundsSetting.value = sortStringArray(
                ["" + bgIDsArraySetting.value[0]]
            );
        }

        // Changes the active background if it is the deleted one
        if(activeBackground === backgroundID)
            BackgroundsManager.instance.changeBackgroundToID(
                BackgroundsManager.instance.getNextID()
            );
    }

    /**
     * If the background get selected then adds it to the selected background
     * array and sorts the array else removes it from the array and sorts it
     */
    const onSelectedChange = () => {
        if(selected) {
            // Deselects the background
            selectedBackgroundsSetting.value = sortStringArray(
                removeFromArray(selectedBackgroundsSetting.value, backgroundID)
            );
            setSelected(false);
            // Changes the active background if it is the deselected one
            if(activeBackground === backgroundID)
                BackgroundsManager.instance.changeBackgroundToID(
                    BackgroundsManager.instance.getNextID()
                );
        }
        else {
            // Selects the background
            selectedBackgroundsSetting.value = sortStringArray(
                addToArray(selectedBackgroundsSetting.value, backgroundID)
            );
            setSelected(true);
        }
    }

    return(
        <div
            className="background-entry"
            id={"background-" + backgroundID}
            style={backgroundStyle}
            onClick={(() => {
                if(
                    !isSingleSelectionInactive &&
                    activeBackground !== backgroundID
                ) {
                    setActiveBackground(backgroundID);
                    BackgroundsManager.instance.changeBackgroundToID(
                        backgroundID
                    );
                }
            })}
        >
            {
                !isSingleSelectionInactive ? (
                    activeBackground === backgroundID ? 
                        <Checkbox
                            isActive={true}
                        /> : null 
                    ) :
                <Checkbox
                    isActive={selected}
                    onChange={onSelectedChange}
                    changeChecker={
                    () => {
                        if(selected)
                            return selectedBackgroundsSetting.value.length > 1
                        else return true;
                    }
                    }
                />
            }
            {
            // Display delete button only if not pre-installed background
            !backgroundsJSON.includes(backgroundID) && <span
                aria-label="background-delete"
                onClick={handleDelete}
            />
            }
            
        </div>
    )
}

/** Contains all backgrounds that can either be selected or deselected */
export const Backgrounds = () => {
    const [
        backgrounds,
        setBackgrounds
    ] = useState<{url: string, id: string}[]>([]);

    useEffect(() => {
        /**
         * Creates JS objects from an array of value, assigning it renderable
         * urls
         * @param values ID array of the backgrounds
         */
        const getBackgrounds = async (values: string[]) => {
            let temp: {url: string, id: string}[] = [];
            for (const id of values) {
                temp.push({
                    id: id,
                    url: await BackgroundsManager.idToUrl(id)
                });
            }
            setBackgrounds(temp);
        }

        bgIDsArraySetting.subscribe((value) => {
            getBackgrounds(value);
        })

        getBackgrounds(bgIDsArraySetting.value);
    }, []) 

    return(
    <div className="backgrounds-container">
        {
            backgrounds.map((background) => {
                return <Background
                    backgroundID={background.id}
                    backgroundURL={background.url}
                    key={background.id}
                />
            })
        }
    </div>
    )
}
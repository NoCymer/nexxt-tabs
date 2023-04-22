import { PanelTab, PanelTabSmallPane } from '@Components/advanced/Panel'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import PaintSplash from "@Public/app-ressources/paint-splash-symbol.svg"
import { t } from 'i18next';
import { usePopup } from '@Hooks/usePopup';
import { useSetting } from '@Hooks/useSetting';
import appManager from '../../AppManager';
import { Popup } from '@Components/advanced/Popup';
import { Button, ButtonContainer } from '@Components/basic/Button';

const DEFAULT_COLORS = [
    "#68B6FF",
    "#7FD6AB",
    "#FFBE5D",
    "#FA7C91",
    "#FF90DE"
]

interface IColorEntry{
    hexValue: string;
    onClick: (color: string) => void;
    key: React.Key;
}
interface ICustomColorEntry extends IColorEntry{
    handleDelete: (color: string) => void
}

/**
 * Default color entry
 * @param hexValue Hexadecimal value of the color
 * @param onClick Callback called when the component is clicked
 */
const ColorEntry = ({hexValue, onClick}: IColorEntry) => {
    const [activeAccent, setActiveAccent] = useSetting(
        appManager.getSetting("main-accent")
    );
    return(
        <span 
            style={{ "--color-var": hexValue } as React.CSSProperties} 
            className={
                `color-entry ${activeAccent === hexValue && "active"}`
            }
            onClick={() => onClick(hexValue)}
        />
    )
}

/**
 * Color entry that the user has picked
 * @param hexValue Hexadecimal value of the color
 * @param onClick Callback called when the component is clicked
 * @param handleDelete Callback called when the component deletion is requested
 */
const CustomColorEntry = (
        {hexValue, handleDelete, onClick}: ICustomColorEntry
    ) => {
    const [activeAccent, setActiveAccent] = useSetting(
        appManager.getSetting("main-accent")
    );
    return(
        <div  
            style={{ "--color-var": hexValue } as React.CSSProperties} 
            className={
                `color-entry custom ${activeAccent === hexValue && "active"}`
            }
            onClick={() => onClick(hexValue)}
        >
            <span onClick={(event) => {
                event.stopPropagation();
                handleDelete(hexValue)
            }}/>
        </div>
    )
}

/**
 * Color palette containg default and user-picked colors
 */
const ColorPalette = () => {
    const { t } = useTranslation();

    const [customColors, setCustomColors] = useSetting<string[]>(
        appManager.getSetting("customization-color-list")
    );

    const [activeAccent, setActiveAccent] = useSetting(
        appManager.getSetting("main-accent")
    );

    let newColor: string;

    /**
     * Updates the color picker with the new selected value
     */
    const updateColorPicked = () => {
        document.documentElement.style.setProperty(
            '--color-picked',
            newColor
        );
    }

    /**
     * Called when the color is picked
     * @param event Click event
     */
    const handleOnColorPicked = (event) => {
        event.preventDefault();
        newColor = event.target.value;
        updateColorPicked();
    }

    /**
     * Deletes a given color by its hex value
     * @param color Hex value of the color
     */
    const handleDelete = (color: string) => {
        let temp = customColors;
        temp = temp.filter(curr => curr != color);
        setCustomColors(temp);
        if(activeAccent === color) {
            selectColor(DEFAULT_COLORS[0]);
            setActiveAccent(DEFAULT_COLORS[0]);
        }
    }

    /**
     * Adds a new color to the custom color setting
     */
    const handleColorSumbit = () => {
        let temp = appManager.getSetting("customization-color-list").value;

        // Prevents duplicate or null colors
        if(
            newColor === "#000000"  || 
            temp.includes(newColor) ||
            newColor == null
        ) {
            newColor = "#000000";
            updateColorPicked();
            setIsPopupVisible(false);
            return;
        }

        temp.push(newColor);
        setCustomColors(temp);
        setIsPopupVisible(false);
        newColor = "#000000";
        updateColorPicked();
    }

    let popupOpener = useRef(null);

    /**
     * Changes the color in the html
     * @param color New color
     */
    const selectColor = (color: string) => {
        document.documentElement.style.setProperty(
            '--accent-secondary-color',
            color
        );
        setActiveAccent(color);
    }

    const [isPopupVisible, setIsPopupVisible] = usePopup(
        <Popup
            popupOpenerRef={popupOpener}
            handleClose={() => setIsPopupVisible(false)}
            className="color-picker-popup"
        >
            <h1>{t("main-accent-desc")}</h1>
            <div className="color-picker">
                <input type="color" onChange={handleOnColorPicked}/>
            </div>
            <ButtonContainer
                direction="inline"
                fitMode="fit"
            >
                <Button
                    callback={handleColorSumbit}
                    options={{color:"success", fillMode:"outlined"}}
                >
                    {t("save")}
                </Button>
                <Button
                    callback={() => {
                        setIsPopupVisible(false);
                    }}
                    options={{color:"danger", fillMode:"outlined"}}
                >
                    {t("cancel")}
                </Button>
            </ButtonContainer>
        </Popup>
    )

    return(
        <div className="color-palette">
            <div className="color-display-title">
                <PaintSplash/>
                <div>
                    <h1>{t("main-accent")}</h1>
                    <h2>{t("main-accent-desc")}</h2>
                </div>
            </div>
            <h3>{t("default-colors")}</h3>
            <div className="color-container">
                {DEFAULT_COLORS.map((color, index) => {
                    return (
                        <ColorEntry 
                            key={index}
                            hexValue={color}
                            onClick={selectColor}
                        />
                    )
                })}
            </div>
            <h3>{t("custom-colors")}</h3>
            <div className="color-container">
                {customColors.map((color, index) => {
                    return (
                        <CustomColorEntry 
                            key={index}
                            hexValue={color}
                            handleDelete={handleDelete}
                            onClick={selectColor}
                        />
                    )
                })}
                <span 
                    className={"color-entry add"}
                    ref={popupOpener}
                    onClick={() => setIsPopupVisible(true)}
                />
            </div>
        </div>
    )
}

/**
 * Tab that displays customization options
 */
export const AppearanceTab = () => {
    const { t } = useTranslation();
    return (
        <PanelTab
            tabID="appearance-tab" 
            tabIconURL="./app-ressources/spraycan-symbol.svg" 
            SmallPane={() => 
                <PanelTabSmallPane>
                <h1>{t("appearance-tab-title")}</h1>
                <span className="separator thick"/>
                <section>
                    <h2>{t("colors-section-title")}</h2>
                    <h3>{t("colors-section-subtitle")}</h3>
                    <ColorPalette/>
                </section>         
                </PanelTabSmallPane>
            }
        />
    )
}
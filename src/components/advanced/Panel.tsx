import React, { useState, useEffect, useRef } from "react";
import $ from "jquery";
import { Setting } from "@Settings/Setting";
import { useSetting } from "@Hooks/useSetting";
import { useFocus } from "@Hooks/useFocus";


interface ISmallPane {
    /** @param tabID DOM Id of the pane */
    tabID?: string;
    /** Additionnal styling scss class name */
    className?: string;
    /** Children of the pane */
    children: any;
}

interface ILargePane {
    /** @param tabID DOM Id of the pane */
    tabID?: string;
    /** Additionnal styling scss class name */
    className?: string;
    /** Children of the pane */
    children: any;
}

interface IPanelTab {
    /** @param tabID DOM Id of the tab */
    tabID: string;
    /** @param tabIconURL URL of the icon of the tab displayed in the panel */
    tabIconURL: string
    /** Additionnal styling scss class name */
    className?: string
    /** @param navbarIconPosition Position of the tab icon in the navbar */
    navbarIconPosition?: ("bottom");
    /** @param smallPane Content of the small pane of the tab */
    SmallPane?: (
        largePaneOpened?: Setting<boolean>
        ) => React.ReactElement<ISmallPane>;
    /** @param largePane Content of the large pane of the tab */
    LargePane?: (
        largePaneOpened?: Setting<boolean>
        ) => React.ReactElement<ILargePane>;
}

const PanelTabSmallPane = (
    {children, tabID, className}
    : ISmallPane):React.ReactElement<ISmallPane> => {
    return(
        <div 
            className={`tab ${className}`} 
            id={tabID + "-small-pane"}
            aria-label="side-panel-tab-small-pane"
        >
            {children}
        </div>
    )
}

const PanelTabLargePane = (
    {children, tabID, className}
    : ILargePane):React.ReactElement<ILargePane> => {
    return(
        <div 
            className={`tab ${className}`} 
            id={tabID + "-large-pane"}
            aria-label="side-panel-tab-large-pane"
        >
            {children}
        </div>
    )
}

const PanelTab: React.FC<IPanelTab> = (
    {
        tabID,
        tabIconURL,
        className,
        navbarIconPosition,
        SmallPane,
        LargePane
    }: IPanelTab) => {
    return(<></>);
}

/**
 * Interface used to describe a Panel 
 */
interface IPanel {
    /** @param idPanel DOM id of the Panel */
    idPanel: string;
    /** @param buttonType Button"s display type */
    buttonType?: ("zone-button");
    /** @param buttonIconURL URL of the Panels"s opening button icon */
    buttonIconURL: string;
    /** @param panelPosition Position of the Panel when opened*/
    panelPosition: ("left" | "right");
    /** @param buttonPosition Position of the button on the main display*/
    buttonPosition: ("tl" | "t" | "tr" | "l" | "r" | "bl" | "b" | "br");
    /** @param children Content of the Panel which must be a PanelTab*/
    children: React.ReactElement<IPanelTab>[] | React.ReactElement<IPanelTab>;
}

let largePaneOpenedStatesSettings: Object = {};

/**
 * A Panel containing tabs that can be displayed on the DOM
 * @param idPanel DOM id of the Panel
 * @param buttonType Button"s display type
 * @param buttonIconURL URL of the Panels"s opening button icon
 * @param panelPosition Position of the Panel when opened
 * @param buttonPosition Position of the button on the main display
 * @param children Content of the Panel which must be a PanelTab
 * @returns Displayable Panel
 */
const Panel = ({
    idPanel,
    buttonType,
    buttonIconURL,
    panelPosition,
    buttonPosition,
    children
    }: IPanel) =>{

    const panel = useRef(null);
    const button = useRef(null);
    
    const [activeTab, setActiveTab] = useState(():string => {
        return (children instanceof Array) ? 
        children[0].props.tabID : children.props.tabID;
    });
    
    const settingName = idPanel + "-large-page-opened-boolean"
    
    let largePaneOpenedSetting: Setting<boolean>;

    
    if(!largePaneOpenedStatesSettings[settingName]) {
        largePaneOpenedSetting = new Setting(settingName, false);
        largePaneOpenedStatesSettings[settingName] = largePaneOpenedSetting;
    }
    else {
        largePaneOpenedSetting = largePaneOpenedStatesSettings[settingName];
    }

    const [largePaneOpened, setLargePaneOpened] = useSetting(
        largePaneOpenedSetting
    );

    useEffect(() => {
        setLargePaneOpened(false);
    }, [])

    const switchTab = (element) => {
        largePaneOpenedSetting.value = false;
        // Removes the part "nav-" in the id to get the tab id
        // ex: nav-general-tab -> general-tab
        let tabId = element.target.id.substring(4); 
        //Toggles the active tab and toggles the desired one
        $(`#${activeTab}`).removeClass("active");
        $(`#${tabId}`).addClass("active");
    
        //Toggles the active navigation tab button and toggles the desired one
        $(`#nav-${activeTab}`).removeClass("active");
        $(`#nav-${tabId}`).addClass("active");
    
        //Stores the new active tab
        setActiveTab(tabId);
    }


    /**
     * Displays the Panel in the browser
     */
    const showPanel = () => {
        $(`#${idPanel}`).addClass("visible");
    }

    /**
     * Hides the Panel in hte browser
     */
    const hidePanel = () => {
        $(`#${idPanel}`).removeClass("visible");
    }

    /** Closes the Panel when clicked aside */
    useFocus([panel, button], hidePanel);

    const getClassName = (panelTab) => {
        return panelTab.props.tabID == activeTab ? 
        "active" : ""
    }

    return(
        <>
        <button 
            ref={button} 
            className={
                `${buttonType ? buttonType : "panel-button"} ${buttonPosition}`
            } 
            onClick={showPanel}
            id={`${idPanel}-btn`}
            key={`${idPanel}-btn`}
            aria-label="side-panel-button">

            <img src={buttonIconURL}/>
        </button>

        <div 
            ref={panel}
            className={`side-Panel ${panelPosition}`}
            id={idPanel}
            key={idPanel}
            aria-label="side-panel"
        >
            <div className="small-Panel">
                <div className="navbar">
                    {
                    (children instanceof Array) ? 
                    children.map(panelTab => {
                        return(
                            <div
                                key={panelTab.props.tabID}
                                className={
                                    `element ${
                                        panelTab.props.tabID == activeTab ? 
                                        "active" : ""
                                    } ${
                                        panelTab.props.navbarIconPosition
                                            === "bottom" ? "bottom" : ""
                                    }`
                                }
                                onClick={switchTab}
                                aria-label="navbar-button"
                                id={"nav-" + panelTab.props.tabID}>
                                <img src={panelTab.props.tabIconURL}/>
                            </div>
                        )
                    }) : 
                    <div
                        key={children.props.tabID}
                        className="element active"
                        onClick={switchTab}
                        id={"nav-" + children.props.tabID}>
                        <img src={children.props.tabIconURL}/>
                    </div>
                    }
                    <div className="active-effect"/>
                </div>
                <div className="content">
                {
                    (children instanceof Array) ? 
                    children.map((panelTab, i) => {
                        return(
                            (() => {
                            if(panelTab.props.SmallPane)
                                return React.cloneElement(
                                    panelTab.props.SmallPane(
                                        largePaneOpenedSetting
                                    ),
                                    {
                                        className: getClassName(panelTab),
                                        tabID: panelTab.props.tabID,
                                        key: i
                                    }
                                )
                            else return "";
                            })()
                        )
                    }) : 
                    (() => {
                        if(children.props.SmallPane)
                        return React.cloneElement(
                            children.props.SmallPane(largePaneOpenedSetting),
                            {
                                className: "active",
                                tabID: children.props.tabID,
                            }
                        )
                        else return "";
                    })()
                }   
                </div>
            </div>
            <div className={`large-Panel ${largePaneOpened ? " visible" : ""}`}>
            {
                (children instanceof Array) ? 
                children.map((panelTab, i) => {
                    return(
                        (() => {
                            if(panelTab.props.LargePane)
                                return React.cloneElement(
                                    panelTab.props.LargePane(
                                        largePaneOpenedSetting
                                    ),
                                    {
                                        className: getClassName(panelTab),
                                        tabID: panelTab.props.tabID,
                                        key: i
                                    }
                                )
                            else return null;
                        })()
                    )
                }) : 
                (() => {
                    if(children.props.LargePane)
                    return React.cloneElement(
                        children.props.LargePane(largePaneOpenedSetting),
                        {
                            className: getClassName(children),
                            tabID: "active",
                        }
                    )
                    else return null;
                })()
            }
            </div>
        </div>
        </>
    )
}

export {
    Panel,
    PanelTab,
    IPanelTab,
    PanelTabSmallPane,
    PanelTabLargePane,
    ISmallPane,
    ILargePane
};
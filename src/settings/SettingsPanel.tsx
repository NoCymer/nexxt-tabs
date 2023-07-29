import React from "react";
import "@Public/i18n/config";
import { Panel } from "@Components/advanced/Panel";
import {
    BackgroundsTab,
    AppearanceTab,
    ModulesTab,
    InfoTab,
    LanguagesTab,
} from "./tabs";

/**
 * Main panel that contains all settings for all parts of the extension
 */
export const SettingsPanel = () => {
    return(
        <Panel 
            buttonIconURL="app-ressources/parameters-symbol.svg"
            buttonPosition="tl"
            idPanel="settings-Panel"
            panelPosition="left"
        >
            {BackgroundsTab()}
            {LanguagesTab()}    
            {AppearanceTab()}
            {ModulesTab()}
            {InfoTab()}
        </Panel>
    )
}
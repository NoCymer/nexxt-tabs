import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "Styles/main.scss";
import { SettingsPanel } from "Settings/";
import { useTranslation } from "react-i18next";
import "Public/i18n/config";
import SearchBar from "Components/advanced/SearchBar";
import $ from "jquery";
import modulesJSON from "./modules/modules.json";
import { ModulesManager } from "Modules/base";
import appManager from "./AppManager";
import BackgroundsManager from "./BackgroundsManager";
import Veil from "./Veil";
import DropDownList from "Components/basic/DropDownList";
import NumberField from "Components/basic/NumberField";
import DateTimeField from "Components/basic/DateTimeField";
import TextField from "Components/basic/TextField";
import { TimeModule } from "Modules/time";
import UpdatePopup from "Components/advanced/UpdatePopup";
import { usePopup } from "./hooks";

const BACKGROUND_LOADING_TIME = 80;

function App() {
    // Translation logic
    const { t, i18n} = useTranslation();

    const [enabledModules, setEnabledModules] = useState(
        ModulesManager.instance.enabledModules
    );

    const languageSetting = appManager
        .getSetting("language-string");
    
    if(i18n.language != languageSetting.value) 
        i18n.changeLanguage(languageSetting.value);
    
    languageSetting.subscribe((e) => {
        i18n.changeLanguage(e);
    })
    

    useEffect(() => {
        ModulesManager.instance.subscribe((value) => {
            setEnabledModules(value);
        });
    }, [])
    

    //Translating Tab Name
    $("title").text(t("browser-tab-title"));

    UpdatePopup();

    return (
        <>
            <SettingsPanel/>
            <SearchBar/>
            {
            enabledModules.map((module) => {
                let moduleId = `module_${module.name}`;
                return(
                    <div id={moduleId} key={moduleId}>
                        {module.rootElement}
                    </div>
                );
            })
            }
        </>
    );
}

const init = async () => {

    // Setting up the theme color
    document.documentElement.style.setProperty(
        '--accent-secondary-color',
        appManager.getSetting("main-accent").value
    );

    // Initialising Backgrounds Manager
    await BackgroundsManager.instance.init();
    
    // Loading modules
    for(let module in modulesJSON) 
    await require(`Modules/${modulesJSON[module]}/index`);
    
    console.log(
        `[INFO] - Successfuly loaded ${Object.keys(modulesJSON).length} modules`
    );
        
    const rootElement = $("#react-target");
        
    if (rootElement) {
        const root = createRoot(rootElement.get(0));
        root.render(<App/>);
    } 

    //Awaiting for background loading then hiding veil
    setTimeout(()=>Veil.hideVeil(),BACKGROUND_LOADING_TIME);
    
}

init();
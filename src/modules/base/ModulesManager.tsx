import { Feature } from "Components/advanced/Feature";
import { useTranslation } from "react-i18next";
import { Module } from "./Module";
import React from "react";
import { Setting } from "Settings/";
import { useSetting } from "../../hooks";

/**
 * Manages every module, implements a singleton pattern therefore cannot be 
 * instantiated, the getInstance method is required to interact 
 * with the ModulesManager
 */
export class ModulesManager{
    /** Modules registered in the manager */
    private _modules = {};

    /** Modules that are currently enabled */
    private _enabledModules = {};

    /** Instance of the ModulesManager  */
    protected static _instance: ModulesManager;

    /** Subscribers of the enabled modules changes */
    private _subscribers:Function[] = [];

    private _modulesActiveTabSetting = new Setting(
        "modules-active-tab",
        "modules-list"
    );

    /**
     * Subribes a new callback which will be called when a module gets enabled
     * or disabled 
     * @param callback Callback to subscribe
     */
    public subscribe(callback:Function) {
        if(!this._subscribers.includes(callback))
            this._subscribers.push(callback);
    }

    /** 
     * Called when a module gets enabled or disabled
     */
    private onEnabledModulesChange() {
        let newEnabledModules = {}
        for(let module in ModulesManager.instance._modules) {
            if(ModulesManager.instance._modules[module].isEnabled())
                newEnabledModules[module] =
                ModulesManager.instance._modules[module];
        }   
        ModulesManager.instance._enabledModules = newEnabledModules;

        ModulesManager.instance._subscribers.forEach((subscriber) => {
            subscriber(ModulesManager.instance.enabledModules);
        })
    }

    /**
     * Fetches the instance of the singleton or creates it if it doesn"t
     * already exists.
     * @returns Instance of the singleton
     */
    public static get instance(): ModulesManager {
        if(!ModulesManager._instance) {
            ModulesManager._instance = new ModulesManager();
        }
        return ModulesManager._instance;
    }

    /** Creates the instance of the singleton pattern */
    protected constructor() { 
        this._modulesActiveTabSetting.value = "modules-list";
    }

    /**
     * Registers a module in the modules manager
     * @param module Module to register
     */
    public register(module: Module) {
        if(!this._modules[module.name]) {
            this._modules[module.name] = module;
            if(module.isEnabled())
                this._enabledModules[module.name] = module;
            module.enabledSetting.subscribe(this.onEnabledModulesChange);
        }
    }

    /** Returns the modules that are registered
     * @returns {Module[]} List of registered modules
     */
    public get modules(): Module[] {
        return Object.values(this._modules);
    }

    /** Returns the modules that are currently enabled
     * @returns {Module[]} List of enabled modules
     */
    public get enabledModules(): Module[] {
        return Object.values(this._enabledModules);
    }

    /** Returns the active tab's setting of the modules's side slider
     * @returns Setting of active tab of the modules's side slider
     */
    public get modulesActiveTabSetting() {
        return this._modulesActiveTabSetting;
    }
}


/** Content of the Modules"Settings Tab
 * containing every modules settings.
 */
export const ModulesSettingsTabContent = () => {

    const { t } = useTranslation();
    const modulesList = ModulesManager.instance.modules;
    const [activeTab, setActiveTab] = useSetting(
        ModulesManager.instance.modulesActiveTabSetting
    );
    return(
        <>
            <div 
                className="side-slider-section"
            >
                <div 
                    className={
                        `side-slider-section-entry ${
                            activeTab == "modules-list" ? "active" : ""
                        }`
                    }
                    id="modules-list"
                    key="modules-list"
                    aria-label="modules-settings-tab-content"
                >
                    <h1>{t("modules")}</h1>
                    <span className="separator thick"/>
                    <section>
                        <h2>{t("modules-title")}</h2>
                        <h3>{t("modules-subtitle")}</h3>
                            
                        {
                            modulesList.map((module, index) => {
                                return (
                                    <div
                                        className="module-settings-section"
                                        key={`${module.name}`}
                                    >
                                        <Feature
                                            title={t(module.title)}
                                            desc={t(module.desc)}
                                            setting={module.enabledSetting}
                                            img={module.iconURL}
                                            key={`${module.name}-state`}
                                        />
                                        {
                                            module.settingsSectionElement &&
                                            <span 
                                                className="modules-settings-button"
                                                onClick={() => setActiveTab(
                                                    module.name + "-tab"
                                                )}
                                            />
                                        }
                                        {
                                            index != modulesList.length-1 &&
                                            <span className="separator thin no-margin"/>
                                        }
                                    </div>
                                )
                            })
                        }
                    </section>
                </div>
                {
                    modulesList.map((module) => {
                        return (
                            module.settingsSectionElement &&
                            <div 
                                className={
                                    `side-slider-section-entry ${
                                        activeTab == (module.name + "-tab") ? 
                                        "active" : 
                                        ""
                                    }`
                                }
                                id={module.name + "-tab"}
                                key={module.name}
                            >
                                <span 
                                    className="modules-settings-back-button"
                                    onClick={
                                        () => setActiveTab("modules-list")
                                    }
                                />
                                <h1 className="module-title">{t(module.title)}</h1>
                                <span className="separator thick"/>
                                <section>
                                    {module.settingsSectionElement}
                                </section>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}
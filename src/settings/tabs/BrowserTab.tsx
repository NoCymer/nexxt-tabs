import { Feature, FeatureField, FeatureOptionCheckbox } from 'Components/advanced/Feature';
import { PanelTab, PanelTabSmallPane } from 'Components/advanced/Panel'
import DropDownList from 'Components/basic/DropDownList';
import React from 'react'
import { useTranslation } from 'react-i18next';
import appManager from '../../AppManager';

const searchEngineSetting = appManager
    .getSetting("search-engine-string");

/**
 * Tab that contains all settings related to search options
 */
export const BrowserTab = () => {
    const { t } = useTranslation();
    return (
        <PanelTab 
            tabID="browser-tab" 
            tabIconURL="app-ressources/lens-symbol.svg" 
            SmallPane={() => 
                <PanelTabSmallPane>
                <h1>{t("search-engine-title")}</h1>
                <span className="separator thick"/>
                <section>
                    <h2>{t("search-engine-title")}</h2>
                    <h3>{t("search-engine-subtitle")}</h3>

                    <FeatureField
                        title={t("search")}
                        desc={t("search-engine-subtitle")}
                        img="app-ressources/app-symbol.svg"
                        field={
                            <DropDownList
                                options={
                                    [
                                        {
                                            content:"Google",
                                            value:"google"
                                        },
                                        {
                                            content:"DuckDuckGo",
                                            value:"duckduckgo"
                                        },
                                        {
                                            content:"Ecosia",
                                            value:"ecosia"
                                        },
                                        {
                                            content:"Qwant",
                                            value:"qwant"
                                        },
                                    ]
                                } 
                                selectedValue={ searchEngineSetting.value }
                                onChange={(value) => 
                                    searchEngineSetting.value = value
                                }
                            />
                        }
                    >
                        <FeatureOptionCheckbox
                            description={t("open-new-page")}
                            img="new-tab"
                            setting={appManager.getSetting(
                                "search-opens-new-page-boolean"
                            )}
                        />
                    </FeatureField>
                    
                </section>
                </PanelTabSmallPane>
            }
        />
    )
}
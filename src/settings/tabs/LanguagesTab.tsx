import { PanelTab, PanelTabSmallPane } from '@Components/advanced/Panel'
import { Choice, ChoiceContainer } from '@Components/basic/Choice'
import React from 'react'
import { useTranslation } from 'react-i18next';
import appManager from '../../AppManager';
import { useTheme } from '@Hooks/useTheme';

const languageSetting = appManager
    .getSetting("language-string");

/**
 * Tab that contains all settings related to languages
 */
export const LanguagesTab = () => {
    const { t } = useTranslation();
    const [theme, setTheme] = useTheme();
    return (
        <PanelTab
            tabID="language-tab" 
            tabIconURL={`app-ressources/${theme}/language-symbol.svg`}
            SmallPane={() => 
                <PanelTabSmallPane>
                <h1>{t("language")}</h1>
                <span className="separator thick"/>
                <section>
                    <h2>{t("language")}</h2>
                    <h3>{t("language-desc")}</h3>
                    <ChoiceContainer setting={languageSetting}>
                        <Choice
                            key="1"
                            img="./app-ressources/countries/usa.png"
                            text="English"
                            value="en"
                        />
                        <Choice
                            key="2"
                            img="./app-ressources/countries/france.png"
                            text="French"
                            value="fr"
                        />
                        <Choice 
                            key="3"
                            img="./app-ressources/countries/spain.png"
                            text="Español"
                            value="es"
                        />
                        <Choice
                            key="4"
                            img="./app-ressources/countries/vietnam.png"
                            text="Tiếng Việt"
                            value="vi"
                        />
                        <Choice
                            key="5"
                            img="./app-ressources/countries/italy.png"
                            text="Italiano"
                            value="it"
                        />
                    </ChoiceContainer>
                </section>         
                </PanelTabSmallPane>
            }
        />
    )
}
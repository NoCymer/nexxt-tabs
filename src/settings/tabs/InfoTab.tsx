import { PanelTab, PanelTabSmallPane } from '@Components/advanced/Panel'
import { Button, ButtonContainer } from '@Components/basic/Button';
import React from 'react'
import { useTranslation } from 'react-i18next';

/**
 * Tab that contains all infos related to the project
 */
export const InfoTab = () => {
    const { t } = useTranslation();
    return (
        <PanelTab
            tabID="info-tab" 
            tabIconURL="./app-ressources/info-symbol.svg" 
            navbarIconPosition="bottom"
            LargePane={() => <></>}
            SmallPane={() => 
                <PanelTabSmallPane>
                <h1>{t("info-tab-title")}</h1>
                <span className="separator thick"/>
                <section className="info-section" id="backgrounds-info">
                    <h1>{t("backgrounds-rights-section")}</h1>
                    <p>{t("backgrounds-rights-section-p1")}</p>
                    <p>{t("backgrounds-rights-section-p2")}</p>
                </section>
                <span className="separator thin"/>
                <section className="info-section" id="icons-info">
                    <h1>{t("icons-rights-section")}</h1>
                    <p>{t("icons-rights-section-p1")}</p>
                </section>
                <span className="separator thin"/>
                <section className="info-section" id="codebase-info">
                    <h1>{t("codebase-rights-section")}</h1>
                    <p>{t("codebase-rights-section-p1")}</p>
                    <ButtonContainer 
                        direction='inline'
                    >
                        <Button
                            callback={() => {
                                window.open(
                                    "https://github.com/NoCymer/nexxt-tabs"
                                );
                            }}
                            options={{color:"success", fillMode:"outlined"}}
                        >
                            {t("contribute")}
                        </Button>
                    </ButtonContainer>
                </section>
                <span className="separator thin"/>
                <section className="info-section" id="feedback-info">
                    <h1>{t("feedback-section")}</h1>
                    <p>{t("feedback-rights-section-p1")}</p>
                    <ButtonContainer 
                        direction='stacked'
                    >
                        <Button
                            callback={() => {
                                window.open(
                                    "https://chrome.google.com/" +
                                    "webstore/detail/nexxt-tabs/" +
                                    "dbocanalfbkfdbpjpnbjmipaidlogbmi"
                                );
                            }}
                            options={{color:"primary", fillMode:"filled"}}
                        >
                            {t("leave-feedback")}
                        </Button>
                        <Button
                            callback={() => {
                                window.open(
                                    "https://forms.gle/cL9F5q3m1WX4Hbv47"
                                );
                            }}
                            options={{color:"danger", fillMode:"outlined"}}
                        >
                            {t("report-bug")}
                        </Button>
                    </ButtonContainer>
                </section>
                <span className="separator thin"/>
                <section className="info-section" id="contact-info">
                    <h1>{t("contact")}</h1>
                    <p>{t("contact-section-p1")}</p>
                    <ButtonContainer 
                        direction='inline'
                    >
                        <Button
                            callback={() => {
                                location.assign(
                                    "mailto:nocymer.dev@outlook.com"
                                );
                            }}
                            options={{color:"primary", fillMode:"outlined"}}
                        >
                            {t("contact-us")}
                        </Button>
                    </ButtonContainer>
                </section>
                </PanelTabSmallPane>
            }
        />
    )
}

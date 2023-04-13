import React from "react";
import { Module, ModulesManager } from "Modules/base";
import moduleJSON from "./module.json";
import Clock from "./clock/Clock";
import Countdown from "./countdown/Countdown";
import DateTimeField from "Components/basic/DateTimeField";
import TextField from "Components/basic/TextField";
import { useTranslation } from "react-i18next";
import { useSetting } from "../../hooks";
import { Choice, ChoiceContainer } from "Components/basic/Choice";
import { FeatureField } from "Components/advanced/Feature";
import { InlineChoice, InlineChoiceContainer } from "Components/basic/InlineChoice";
import appManager from "../../AppManager";

moduleJSON["settings"]["countdown-datetime"]["defaultValue"] = 
    (new Date(Date.now())).getTime();


/**
 * Manages the Time module 
 */
const TimeModule: Module = new Module(moduleJSON);

const upperScreenSetting = TimeModule.getSetting("display-upper-selection");
const lowerScreenSetting = TimeModule.getSetting("display-lower-selection");

const TimeSettingSection = () => {
    const { t } = useTranslation();

    return (
        <>
            <h2>{t("upper-display-title")}</h2>
            <h3>{t("upper-display-subtitle")}</h3>
            <ChoiceContainer setting={upperScreenSetting}>
                <Choice
                    key="1"
                    img="app-ressources/none-symbol.svg"
                    activeImg="app-ressources/none-black-symbol.svg"
                    text={t("none")}
                    value="none"
                />
                <Choice
                    key="2"
                    img="app-ressources/digital-clock-symbol.svg"
                    activeImg="app-ressources/digital-clock-black-symbol.svg"
                    text={t("clock")}
                    value="clock"
                />
                <Choice 
                    key="3"
                    img="app-ressources/hourglass-symbol.svg"
                    activeImg="app-ressources/hourglass-black-symbol.svg"
                    text={t("countdown")}
                    value="countdown"
                />
            </ChoiceContainer>
            <span className="separator medium"/>
            <h2>{t("lower-display-title")}</h2>
            <h3>{t("lower-display-subtitle")}</h3>
            <ChoiceContainer setting={lowerScreenSetting}>
                <Choice
                    key="1"
                    img="app-ressources/none-symbol.svg"
                    activeImg="app-ressources/none-black-symbol.svg"
                    text={t("none")}
                    value="none"
                />
                <Choice
                    key="2"
                    img="app-ressources/digital-clock-symbol.svg"
                    activeImg="app-ressources/digital-clock-black-symbol.svg"
                    text={t("clock")}
                    value="clock"
                />
                <Choice 
                    key="3"
                    img="app-ressources/hourglass-symbol.svg"
                    activeImg="app-ressources/hourglass-black-symbol.svg"
                    text={t("countdown")}
                    value="countdown"
                />
            </ChoiceContainer>
            <span className="separator medium"/>
            <h2>{t("time-module-countdown-section-title")}</h2>
            <h3>{t("time-module-countdown-section-subtitle")}</h3>
            <FeatureField
                title={t("label")}
                desc={t("countdown-label-desc")}
                img="app-ressources/label-symbol.svg"
                field={
                    <TextField 
                        placeholder={t("label")}
                        onInput={(val)=> {
                            TimeModule.getSetting(
                                "countdown-label-string"
                            ).value = val;
                        }} 
                        defaultValue={
                            TimeModule.getSetting(
                                "countdown-label-string"
                            ).value
                        }
                    />
                }
            >
            </FeatureField>
            <span className="separator thin no-margin"/>
            <FeatureField
                title={t("date")}
                desc={t("countdown-date-desc")}
                img="app-ressources/calendar-symbol.svg"
                field={
                    <DateTimeField 
                        onInput={(val)=> {
                            TimeModule.getSetting(
                                "countdown-datetime"
                            ).value = val;
                        }} 
                        defaultValue={new Date(
                            TimeModule.getSetting(
                                "countdown-datetime"
                            ).value
                        )}
                    />
                }
            />
            <span className="separator medium"/>
            <h2>{t("clock-title")}</h2>
            <h3>{t("clock-desc")}</h3>
            <FeatureField
                title={t("time-format")}
                desc={t("time-format-desc")}
                img="app-ressources/time-format-symbol.svg"
                field={
                <InlineChoiceContainer 
                    setting={appManager.getSetting("time-format-string")}
                >
                    <InlineChoice
                        key="1" 
                        text="12H"
                        value="12h"
                    />
                    <InlineChoice
                        key="2" 
                        text="24H"
                        value="24h"
                    />
                </InlineChoiceContainer>
                }
            />
        </>
    )
}


const TimeRoot = () => {
    const [topElement, setTopElement] = useSetting(upperScreenSetting)

    const [bottomElement, setBottomElement] = useSetting(lowerScreenSetting)

    const Top = () => {
        switch (topElement) {
            case "clock":
                return <Clock position="top"/>
            case "countdown":
                return <Countdown position="top"/>
            default:
                return null;
        }
    }

    const Bottom = () => {
        switch (bottomElement) {
            case "clock":
                return <Clock position="bottom"/>
            case "countdown":
                return <Countdown position="bottom"/>
            default:
                return null;
        }
    }

    return (
        <>
            <Top/>
            <Bottom/>
        </>
    )
}

TimeModule.settingsSectionElement = <TimeSettingSection/>

TimeModule.rootElement = <TimeRoot/>
    

ModulesManager.instance.register(TimeModule);

export { TimeModule };
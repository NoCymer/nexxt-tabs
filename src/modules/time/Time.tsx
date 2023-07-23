import React, { useEffect, useState } from "react";
import { Module } from "@Modules/base/Module";
import { ModulesManager } from "@Modules/base/ModulesManager";
import moduleJSON from "./module.json";
import Clock from "./clock/Clock";
import "./styles/countdown.scss";
import DateTimeField from "@Components/basic/DateTimeField";
import TextField from "@Components/basic/TextField";
import { useTranslation } from "react-i18next";
import { useSetting } from "@Hooks/useSetting";
import { Choice, ChoiceContainer } from "@Components/basic/Choice";
import { FeatureField } from "@Components/advanced/Feature";
import { InlineChoice, InlineChoiceContainer } from "@Components/basic/InlineChoice";
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


interface ICountdown{
    position : ("top" | "bottom");
}

/**
 * Countdown element
 */
const Countdown = ({position}: ICountdown) => {
    const [countdownPosition, setCountdownPosition] = useState(position);
    
    const [countdownDate, setCountdownDate] = useSetting(
        TimeModule.getSetting("countdown-datetime")
    );

    const [label, setLabel] = useSetting(
        TimeModule.getSetting("countdown-label-string")
    );

    const { t } = useTranslation();

    const [time, setTime] = useState({
        d: "00",
        h: "00",
        m: "00",
        s: "00"    
    });

    const updateTime = (datetime: number) => {
        const now = new Date();
        const eventDate = new Date(datetime);
        const remTime = eventDate.getTime() - now.getTime();
        let s = Math.floor(remTime / 1000);
        let m = Math.floor(s / 60);
        let h = Math.floor(m / 60);
        let d = Math.floor(h / 24);
        
        h %= 24;
        m %= 60;
        s %= 60;

        // If date is already passed then prevent going in negative values
        if((h + m + s + d) <= 0 ) {
            setTime({
                d: "0",
                h: "0",
                m: "0",
                s: "0"
            });
        }
        else {
            setTime({
                d: "" + d,
                h: "" + h,
                m: "" + m,
                s: "" + s    
            });
        }
    }
    
    useEffect(() => {
        updateTime(countdownDate);
        let interval = setInterval(() => updateTime(countdownDate), 1000);
        return () => {
            clearInterval(interval);
        };
    }, [countdownDate])

    useEffect(() =>  setCountdownPosition(position), [position])

    return (
        <div className={"countdown-container " + countdownPosition}>
            <h4 className="countdown-label">{label}</h4>
            <div className="countdown">
                <div className="countdown-number-container">
                    <h4 className="countdown-section">{time.d}</h4>
                    <span>:</span>
                    <h4 className="countdown-section">{time.h}</h4>
                    <span>:</span>
                    <h4 className="countdown-section">{time.m}</h4>
                    <span>:</span>
                    <h4 className="countdown-section">{time.s}</h4>
                </div>
                <div className="countdown-units-container">
                    <h4 className="countdown-section">{t("days")}</h4>
                    <span/>
                    <h4 className="countdown-section">{t("hours")}</h4>
                    <span/>
                    <h4 className="countdown-section">{t("minutes")}</h4>
                    <span/>
                    <h4 className="countdown-section">{t("seconds")}</h4>
                </div>
            </div>
        </div>
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
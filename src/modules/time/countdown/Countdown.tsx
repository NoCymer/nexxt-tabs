import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { TimeModule } from "../Time";
import { useSetting } from "Hooks";
import "../styles/countdown.scss";

let interval: NodeJS.Timer;

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
    )

    const [label, setLabel] = useSetting(
        TimeModule.getSetting("countdown-label-string")
    )

    const { t } = useTranslation();

    const [time, setTime] = useState({
        d: "00",
        h: "00",
        m: "00",
        s: "00"    
    }) 

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
            })
        }
        else {
            setTime({
                d: "" + d,
                h: (h < 10) ? "0" + h : "" + h,
                m: (m < 10) ? "0" + m : "" + m,
                s: (s < 10) ? "0" + s : "" + s    
            })
        }
    }

    useEffect(() => {
        updateTime(countdownDate);
        if(interval) clearInterval(interval);
        interval = setInterval(() => updateTime(countdownDate),100);
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

export default Countdown;
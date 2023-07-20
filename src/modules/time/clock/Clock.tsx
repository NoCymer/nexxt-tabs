import React, { useEffect, useState } from "react"
import appManager from "../../../AppManager";
import { useSetting } from "@Hooks/useSetting";
import "../styles/clock.scss";

const dateToString = (date: Date, format: string) => {
    return date.toLocaleTimeString([], (
        format === "24h" ? {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: "h23"
        } : {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: "h12"
        }
    ))
}

interface IClock{
    position : ("top" | "bottom");
}

/**
 * Simple clock element
 */
const Clock = ({position}: IClock) => {

    const [formatSetting, setFormatSetting] = useSetting(
        appManager.getSetting("time-format-string")
    );

    const [timeString, setTimeString] = useState(
        dateToString(new Date(), formatSetting)
    );

    const [clockPosition, setClockPosition] = useState(position);

    const updateTime = () => {
        let now = new Date();
        setTimeString(dateToString(now, formatSetting));
    }

    useEffect(() => {
        updateTime();
        let interval = setInterval(updateTime, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [formatSetting])

    useEffect(() =>  setClockPosition(position), [position])

    return (
        <div className={"clock-container " + clockPosition}>
            <h4 className="clock-hours">{timeString.slice(0,2)}</h4>
            <span className="clock-separator"></span>
            <h4 className="clock-minutes">{timeString.slice(3,5)}</h4>
            <h4 className="clock-period">{timeString.slice(6,8)}</h4>
        </div>
    )
}

export default Clock;
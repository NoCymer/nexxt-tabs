import "./styles/animeSchedule.scss";
import React, { useEffect, useState } from "react";
import { Panel, PanelTab, PanelTabSmallPane } from "@Components/advanced/Panel";
import { useTranslation } from "react-i18next";
import "@Public/i18n/config";
import axios from "axios";
import { Module } from "@Modules/base/Module";
import { ModulesManager } from "@Modules/base/ModulesManager";
import moduleJSON from "./module.json";
import Anime from "./Anime";
import DateTimeConverter from "./DateTimeConverter";
import appManager from "../../AppManager";
import { 
    InlineChoice,
    InlineChoiceContainer
} from "@Components/basic/InlineChoice";
import { Setting } from "@Settings/Setting";
import { useSetting } from "@Hooks/useSetting";
import { FeatureField } from "@Components/advanced/Feature";

const JIKAN_COOLDOWN = 500; // cooldown in ms

const JIKAN_FULL_FETCH_COOLDOWN = 10000; // cooldown in ms

/**
 * Manages the anime schedule module 
 */
const AnimeScheduleModule: Module = new Module(moduleJSON);

const todayDay = 
    DateTimeConverter.dayIntToString(new Date().getDay()).toLowerCase();

const activeTabSetting = new Setting(
    "schedule-active-tab",
    todayDay
);

activeTabSetting.value = todayDay;


const quarterListTwelve = [
    "12:00am ~ 3:00am",
    "3:00am ~ 6:00am",
    "6:00am ~ 9:00am",
    "9:00am ~ 12:00pm",
    "0:00pm ~ 1:00pm",
    "3:00pm ~ 6:00pm",
    "6:00pm ~ 9:00pm",
    "6:00pm ~ 12:00am"
]
const quarterListTwentyFour = [
    "00:00 ~ 3:00",
    "3:00 ~ 6:00",
    "6:00 ~ 9:00",
    "9:00 ~ 12:00",
    "12:00 ~ 15:00",
    "15:00 ~ 18:00",
    "18:00 ~ 21:00",
    "21:00 ~ 00:00"
]
const scheduleSetting = AnimeScheduleModule
    .getSetting("schedule-weekday-entries-array");

const timeFormatSetting = appManager
    .getSetting("time-format-string");

interface IAnimeScheduleEntry {
    anime: Anime;
}

const AnimeScheduleEntry = ({anime}: IAnimeScheduleEntry) => {
    const { t } = useTranslation();
    
    return(
        //Checks if the anime is valid by checking its id which cannot be null 
        // or equal to 0
        anime.id != 0 ?
        <div 
            className="anime-schedule-entry" 
            style={{backgroundImage: `url(${anime.thumbnailURL})`}}>

            <div className="veil"></div>
            <h1 
                className="broadcast-time" 
                title={anime.weeklyReleaseTime24}>
                        {anime.weeklyReleaseTime24}
            </h1>
            <a className="button" href={anime.malURL} target="_blank">
                {t("view")}
            </a>
            <h1 className="title">{anime.title}</h1>
        </div> : <></>
    )
}

/**
 * Checks if the entry"s broadcast day is not null and has an non default image
 * @param entry 
 * @returns 
 */
const isEntryValid = (entry) => {
    if (
        entry["broadcast"]["day"] == null 
        || entry["broadcast"]["time"] == null
        || entry["images"]["jpg"]["image_url"] == null
        || entry["images"]["jpg"]["image_url"] == (
            "https://cdn.myanimelist.net/img/sp/icon/" +
            "apple-touch-icon-256.png"
        )
    )  return false;
    return true;
}

/**
 * Sleeps for ms time
 * @param ms time to sleep 
 * @returns 
 */
const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const AnimeScheduleWeek = () => {
    

    /**
     * Fetches Jikan's api's data if online else uses cached value
     * @returns Anime Schedule Object
     */
    const getAnimes = async () => {
        let animeList: Anime[] = [];
        let hasNext = true;
        let currentPage = 1;
        let lastFetch = 0;

        const fetchPage = async (page: number) => {
            let currentTime = Date.now();
            let deltaTime = currentTime - lastFetch;
            if(deltaTime < JIKAN_COOLDOWN) await sleep(JIKAN_COOLDOWN - deltaTime);
            await axios.get(`https://api.jikan.moe/v4/schedules?limit=25&page=${page}`)
            .then(response => {
                hasNext = JSON.parse(response.data["pagination"]["has_next_page"]);
                response.data["data"].forEach((entry: Object) => {
                    
                    if (!isEntryValid(entry)) return;
        
                    let date = DateTimeConverter.getCurrentWeekDateTime(
                        DateTimeConverter.dayStrToInt(
                            entry["broadcast"]["day"]
                        ),
                        entry["broadcast"]["time"],
                        "UTC+9"
                    );
                        
        
                    animeList.push(
                        new Anime(
                            entry["mal_id"],
                            entry["title"],
                            entry["synopsis"],
                            entry["images"]["jpg"]["image_url"],
                            entry["url"],
                            date
                        )
                    );
                });
            })
            .catch(function(error) {
                console.error(`[ERROR] : Fetching api.jikan.moe lead to the` + 
                    `following error: ${error}`
                );
                hasNext = false;
            });
            lastFetch = Date.now();
        }

        let updateRequired = (
            Date.now() -
            AnimeScheduleModule.getSetting("schedule-last-update").value
        ) > JIKAN_FULL_FETCH_COOLDOWN

        let canUpdate = (
            Date.now() -
            AnimeScheduleModule.getSetting("schedule-last-update-try").value
        ) > JIKAN_FULL_FETCH_COOLDOWN

        // Accesses jikan's anime api if necessary, else uses cached schedule
        if (navigator.onLine && updateRequired && canUpdate) {
            AnimeScheduleModule.getSetting("schedule-last-update-try").value = Date.now();
            while(hasNext) {
                await fetchPage(currentPage);
                currentPage++
            }
            AnimeScheduleModule.getSetting("schedule-last-update").value = Date.now();
        }
        else{
            console.warn("[WARNING] : Loading cached schedule : " + 
                "Results may be outdated"
            );

            // Converts every entry in the setting to an Anime instance
            scheduleSetting.value.forEach((anime: Object) => {
                animeList.push(Anime.fromJSON(anime))
            })      
        }
        return animeList;
    }

    let emptyAnimeList: Anime[] = [];

    const [animeSchedule, setAnimeSchedule] = useState(emptyAnimeList);

    // Fetches Jikan"s api then updates the component once
    // to display the schedule
    useEffect(() => {
        getAnimes().then((animes) => {
            setAnimeSchedule(animes);
            scheduleSetting.value = animes;
        });
    },[])

    /**
     * Returns the week React Element containing each day filled with its
     * quarters and anime entries corresponding
     */
    const getWeek = () => {
        //Initializes an empty week object
        let week: {
            "Mondays": Anime[][],
            "Tuesdays": Anime[][],
            "Wednesdays": Anime[][],
            "Thursdays": Anime[][],
            "Fridays": Anime[][],
            "Saturdays": Anime[][],
            "Sundays": Anime[][]
        } = {
            "Mondays" : [[],[],[],[],[],[],[],[]],
            "Tuesdays" : [[],[],[],[],[],[],[],[]],
            "Wednesdays" : [[],[],[],[],[],[],[],[]],
            "Thursdays" : [[],[],[],[],[],[],[],[]],
            "Fridays" : [[],[],[],[],[],[],[],[]],
            "Saturdays" : [[],[],[],[],[],[],[],[]],
            "Sundays" : [[],[],[],[],[],[],[],[]]
        };

        //Populates the week accordingly to every anime"s quarter if its
        // title isn"t null
        animeSchedule.forEach((anime) => {
            anime.title != "" ?
            week[anime.weeklyReleaseDayString][(anime.quarter) - 1]
            .push(anime) : "";
        })

        const [activeDay, setActiveDay] = useState(todayDay);

        useEffect(() => {
            activeTabSetting.subscribe((e) => {
                setActiveDay(e);
            })
        },[])

        const [timeFormat, setTimeFormat] = useSetting(timeFormatSetting);

        return(
            <>
            {//Iterates over evey day in the week
            Object.keys(week).map((day) => {
            return (
            <div 
                className={
                    `side-slider-section-entry ${
                        activeDay == day.toLowerCase() ? "active" : ""
                    }`
                }
                id={day}
                key={day}
            >
                {//Iterates over every quarter of each day
                week[day].map((quarter: Anime[]) => {
                if (quarter.length == 0) return null;
                return (
                <div 
                    className="day-quarter"
                    key={week[day].indexOf(quarter)}
                >

                    {/* Displays the quarter localised in
                        12h or 24h format */
                    }
                    <div className="quarter-header">
                        <img src="app-ressources/clock-symbol.svg" alt="" />
                        <h1>
                        {
                            timeFormat === "12h" ?
                            quarterListTwelve[week[day].indexOf(quarter)] :
                            quarterListTwentyFour[week[day].indexOf(quarter)]
                        }
                        </h1>
                    </div>
                    <div className="quarter-content">
                        {//Iterates over every anime of each quarter of
                        // each day
                        quarter.map(
                            anime => 
                                <AnimeScheduleEntry 
                                    key={anime.id}
                                    anime={anime}
                                />
                            )
                        }
                    </div>
                </div>
                );
                })}
            </div>)
            })}
            </>
        )
    }

    return(
        <>
            { getWeek() }
        </>
    );
}

const AnimeSchedulePanel = () => {
    const { t } = useTranslation();

    return(
        <Panel 
            idPanel="schedule-Panel" 
            buttonType="zone-button"
            buttonIconURL="./app-ressources/arrow-left-symbol.svg"
            panelPosition="right"
            buttonPosition="r">

            <PanelTab
                key="schedule" 
                tabID="schedule-tab" 
                tabIconURL="./app-ressources/schedule-symbol.svg"
                SmallPane={() => {
                    return(
                        <PanelTabSmallPane>
                        <h1>{t("schedule")}</h1>
                        <span className="separator thick"/>
                        <section>
                            <h2>{t("weekday")}</h2>
                            <h3>{t("weekday-subtitle")}</h3>
                            <InlineChoiceContainer 
                                setting={activeTabSetting}
                            >
                                <InlineChoice
                                    key="1" 
                                    text={t("monday-short")}
                                    value="mondays"
                                />
                                <InlineChoice
                                    key="2" 
                                    text={t("tuesday-short")}
                                    value="tuesdays"
                                />
                                <InlineChoice
                                    key="3" 
                                    text={t("wednesday-short")}
                                    value="wednesdays"
                                />
                                <InlineChoice
                                    key="4" 
                                    text={t("thursday-short")}
                                    value="thursdays"
                                />
                                <InlineChoice
                                    key="5" 
                                    text={t("friday-short")}
                                    value="fridays"
                                />
                                <InlineChoice
                                    key="6" 
                                    text={t("saturday-short")}
                                    value="saturdays"
                                />
                                <InlineChoice
                                    key="7" 
                                    text={t("sunday-short")}
                                    value="sundays"
                                />
                            </InlineChoiceContainer>
                            <span className="separator thin"/>
                            <div className="side-slider-section">
                                <AnimeScheduleWeek/>
                            </div>
                        </section> 
                        </PanelTabSmallPane>
                    )
                }}
                />
        </Panel>
    )
} 

const AnimeScheduleSettings = () => {
    const { t } = useTranslation();
    return(
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
    )
}

AnimeScheduleModule.rootElement = <AnimeSchedulePanel/>;

AnimeScheduleModule.settingsSectionElement = <AnimeScheduleSettings/>;

    
ModulesManager.instance.register(AnimeScheduleModule);

export { AnimeScheduleModule };
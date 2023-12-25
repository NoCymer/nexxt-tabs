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
import { useTheme } from "@Hooks/useTheme";

const JIKAN_COOLDOWN = 850; // cooldown in ms

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


const cacheStructure = {
    "_id": 0,
    "_title": "",
    "_synopsis": "",
    "_thumbnailURL": "",
    "_malURL": "",
    "_nextReleaseDate": "",
    "_quarter": 0
}

/**
 * Checks if the given cache for the schedule is valid or not
 * @param cache Cache to check
 * @returns True if the cache is valid, else false.
 */
export const isCacheValid = (cache: any[]) => {
    try {
        for(let i = 0; i < cache.length; i++) {
            let curr = cache[i];
            for(let key in cacheStructure)
                if (!Object.keys(curr).includes(key)) return false;
        }
    } catch { return false; }
    return true;
}

/**
 * Transform the given cache into a valid form in case of invalid cache
 * @param cache Cache to validate
 * @returns validated cache
 */
export const validateCache = (cache) => {
    return isCacheValid(cache) ? cache : [{}];
}

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

// Checks for default value and sanitize it for avoiding unwanted quarter
try {
    if(scheduleSetting.value[0]["_quarter"] === -1) {
        scheduleSetting.value = [];
    }
} catch(e) {}

const timeFormatSetting = appManager
    .getSetting("time-format-string");

interface IAnimeScheduleEntry {
    anime: Anime;
}

const AnimeScheduleEntry = ({anime}: IAnimeScheduleEntry) => {
    const { t } = useTranslation();
    const [timeFormat, setTimeFormat] = useSetting(timeFormatSetting);
    
    return(
        // Checks if the anime is valid by checking its id which cannot be null 
        // or equal to 0
        anime.id != 0 ?
        <div 
            className="anime-schedule-entry"
        >
            <img src={anime.thumbnailURL} className="bg-img"></img>
            <div className="veil">i</div>
            <h1 
                className="broadcast-time" 
                title={ timeFormat === "24h" ? anime.weeklyReleaseTime24 : anime.weeklyReleaseTime12 }
            >
                { timeFormat === "24h" ? anime.weeklyReleaseTime24 : anime.weeklyReleaseTime12 }
            </h1>
            <a className="button" href={anime.malURL} target="_blank" tabIndex={-1}>
                {t("view")}
            </a>
            <h1 className="title">{anime.title}</h1>
        </div> : <></>
    )
}

/**
 * Checks if the entry's broadcast day is not null and has an non default image
 * @param entry Entry fetched from jikan's api
 * @returns True if the entry is valid
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

const entryAlreadyExist = (entry, list:any[]) => {
    for(let i = 0; i < list.length; i++)
        if(list[i]["id"] == entry["mal_id"]) 
            return true;
    return false;
}

/**
 * Sleeps for ms time
 * @param ms time to sleep 
 * @returns 
 */
const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

interface IAnimeScheduleWeek{
    shouldBeDisplayedSetting: Setting<boolean>
}

const AnimeScheduleWeek = ({shouldBeDisplayedSetting}: IAnimeScheduleWeek) => {
    const [theme, setTheme] = useTheme();
    const [shouldBeDisplayed, setShouldBeDisplayed] = useSetting(shouldBeDisplayedSetting);
    

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
                    if (entryAlreadyExist(entry, animeList)) return;
        
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
            AnimeScheduleModule
                .getSetting("schedule-last-update-try").value = Date.now();
            while(hasNext) {
                await fetchPage(currentPage);
                currentPage++
            }
            AnimeScheduleModule
                .getSetting("schedule-last-update").value = Date.now();
        }
        else{
            console.log("[WARNING] : Loading cached schedule : " + 
                "Results may be outdated"
            );
            
            if(isCacheValid(scheduleSetting.value)) {
                // Converts every entry in the setting to an Anime instance
                scheduleSetting.value.forEach((anime: Object) => {
                    animeList.push(Anime.fromJSON(anime))
                })      
            } else {
                scheduleSetting.value = validateCache(scheduleSetting.value);
                console.log("[ERROR] : Invalid cache deteted, reload required");
            }
        }
        return animeList;
    }

    let animeList: Anime[] = [];

    if(isCacheValid(scheduleSetting.value)) {
        // Loads cached schedule
        scheduleSetting.value.forEach((anime: Object) => {
            animeList.push(Anime.fromJSON(anime))
        });
    } else {
        scheduleSetting.value = validateCache(scheduleSetting.value);
    }

    const [animeSchedule, setAnimeSchedule] = useState(animeList);

    // Fetches Jikan"s api then updates the component once
    // to display the schedule
    useEffect(() => {
        getAnimes().then((animes) => {
            setAnimeSchedule(animes);
            scheduleSetting.value = animes;
        });
    },[])

    const getQuarters = (week, day, timeFormat) => {
        return week[day].map((quarter: Anime[]) => {
            if (quarter.length < 1)
                return null;
            return (
                <div
                    className="day-quarter"
                    key={week[day].indexOf(quarter)}
                >

                    {
                    /* Displays the quarter localised in 12h or 24h format */}
                    <div className="quarter-header">
                        <img src={`app-ressources/${theme}/clock-symbol.svg`} alt="" />
                        <h1>
                            {timeFormat === "12h" ?
                                quarterListTwelve[week[day].indexOf(quarter)] :
                                quarterListTwentyFour[week[day].indexOf(quarter)]}
                        </h1>
                    </div>
                    <div className="quarter-content">
                        {//Iterates over every anime of each quarter of
                            // each day
                            quarter.map(
                                anime => <AnimeScheduleEntry
                                    key={anime.id}
                                    anime={anime} />
                            )}
                    </div>
                </div>
            );
        });
    }
 
    /**
     * Checks whether or not a day has been loaded
     * @param day 
     * @param week 
     * @returns True if the day has no anime to display
     */
    const isDayLoaded = (day, week) => {
        for(let quarter in week[day])
            if(week[day][quarter].length > 0) return false;
        return true;
    }

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

        // Populates the week accordingly to every anime"s quarter if its
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
            {
            shouldBeDisplayed && 
            //Iterates over evey day in the week
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
                {
                    //Iterates over every quarter of each day
                    isDayLoaded(day, week) ? <img src={`app-ressources/${theme}/loading-symbol.svg`} className="loading-wheel"/> : getQuarters(week, day, timeFormat)
                }
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
    const [theme, setTheme] = useTheme();
    const [activeDay, setActiveDay] = useState((new Date(Date.now())).getDay());

    return(
        <Panel 
            idPanel="schedule-Panel" 
            buttonType="zone-button"
            buttonIconURL="app-ressources/dark/arrow-left-symbol.svg"
            panelPosition="right"
            buttonPosition="r">

            <PanelTab
                key="schedule" 
                tabID="schedule-tab" 
                tabIconURL={`app-ressources/${theme}/schedule-symbol.svg`}
                SmallPane={(largePaneOpenedSetting, smallPaneOpenedSetting) => {
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
                                    className={activeDay == 1 ? "highlight" : ""}
                                />
                                <InlineChoice
                                    key="2" 
                                    text={t("tuesday-short")}
                                    value="tuesdays"
                                    className={activeDay == 2 ? "highlight" : ""}
                                />
                                <InlineChoice
                                    key="3" 
                                    text={t("wednesday-short")}
                                    value="wednesdays"
                                    className={activeDay == 3 ? "highlight" : ""}
                                />
                                <InlineChoice
                                    key="4" 
                                    text={t("thursday-short")}
                                    value="thursdays"
                                    className={activeDay == 4 ? "highlight" : ""}
                                />
                                <InlineChoice
                                    key="5" 
                                    text={t("friday-short")}
                                    value="fridays"
                                    className={activeDay == 5 ? "highlight" : ""}
                                />
                                <InlineChoice
                                    key="6" 
                                    text={t("saturday-short")}
                                    value="saturdays"
                                    className={activeDay == 6 ? "highlight" : ""}
                                />
                                <InlineChoice
                                    key="7" 
                                    text={t("sunday-short")}
                                    value="sundays"
                                    className={activeDay == 0 ? "highlight" : ""}
                                />
                            </InlineChoiceContainer>
                            <span className="separator thin"/>
                            <div className="side-slider-section">
                                <AnimeScheduleWeek shouldBeDisplayedSetting={smallPaneOpenedSetting}/>
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
    const [theme, setTheme] = useTheme();
    return(
        <FeatureField
            title={t("time-format")}
            desc={t("time-format-desc")}
            img={`app-ressources/${theme}/time-format-symbol.svg`}
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
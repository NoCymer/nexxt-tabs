import { t } from "i18next";
import React, { useState } from "react";
import appManager from "../../AppManager";
import { useSetting } from "@Hooks/useSetting";


/**
 * Search bar linked to the searchEngine setting
 */
const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const search = (text: string) => {
        if(typeof browser === "undefined") {
            chrome.search.query(
                {
                    disposition: "CURRENT_TAB",
                    text: text
                }
            );
            return;
        }
        browser.search.query({
            text: text,
            disposition: "CURRENT_TAB",
        });
    }

    const handleClick = (e) => {
        e.preventDefault(); // Preventing form default behaviour
        if(searchQuery.trim().length === 0) 
            return; //Preventing search with empty string
        search(searchQuery);
    }

    const handleChange=(e) => {
        setSearchQuery(e.target.value);
    }

    const [opacity, setOpacity] = useSetting(appManager.getSetting("search-bar-opacity"));
    const [blurAmount, setBlurAmount] = useSetting(appManager.getSetting("search-bar-blur-amount"));

    return(
        <form id="search-bar-wrapper" onSubmit={handleClick}>
            <span className="lens" onClick={handleClick}></span>
            <input 
                type="text"
                autoComplete="off"
                placeholder={t("search")}
                id="search-bar"
                tabIndex={1}
                onChange={handleChange}
            /> 
            <span className="bg" style={{opacity: opacity}}/>
            <span className="blur-bg" style={{backdropFilter: `blur(${blurAmount}px)`}}/>
        </form>
    )
}

export default SearchBar;

import { t } from "i18next";
import React, { useState } from "react";
import appManager from "../../AppManager";
import { useSetting } from "@Hooks/useSetting";


/**
 * Search bar linked to the searchEngine setting
 */
const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const openLink = (link: string) => {
        if(appManager.getSetting("search-opens-new-page-boolean").value)
            window.open(link);
        else
            location.assign(link);
    }

    const handleClick = (e) => {
        e.preventDefault(); // Preventing form default behaviour
        if(searchQuery.trim().length === 0) 
            return; //Preventing search with empty string
        switch(appManager
            .getSetting("search-engine-string")
            .value) {

            case "google": 
                openLink(`https://google.com/search?q=${searchQuery}`);
                break;
            case "duckduckgo": 
                openLink(`https://duckduckgo.com/?q=${searchQuery}`);
                break;
            case "qwant": 
                openLink(`https://qwant.com/?q=${searchQuery}`);
                break;
            case "ecosia": 
                openLink(`https://ecosia.org/search?q=${searchQuery}`);
                break;
        }
    }

    const handleChange=(e) => {
        setSearchQuery(e.target.value);
    }

    const [opacity, setOpacity] = useSetting(appManager.getSetting("search-bar-opacity"));

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
        </form>
    )
}

export default SearchBar;

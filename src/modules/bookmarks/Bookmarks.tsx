import React, {  useRef } from "react";
import "./styles/bookmark.scss";
import { Module } from "@Modules/base/Module";
import { ModulesManager } from "@Modules/base/ModulesManager";
import moduleJSON from "./module.json";
import { Bookmark } from "./Bookmark";
import { useTranslation } from "react-i18next";
import { usePopup } from "@Hooks/usePopup";
import { useSetting } from "@Hooks/useSetting";
import { Popup } from "@Components/advanced/Popup";
import { Button, ButtonContainer } from "@Components/basic/Button";
import { Feature } from "@Components/advanced/Feature";

/**
 * Manages the bookmarks module 
 */
const BookmarksModule: Module = new Module(moduleJSON);

interface IBookmark{
    bookmark: Bookmark
}

type BookmarkObject = {
    url: string
    title: string
}

const bookmarkNewTabSetting = BookmarksModule
    .getSetting("bookmark-new-page-boolean");

const bookmarkListSetting = BookmarksModule
    .getSetting("bookmark-list");

/**
 * Bookmark element, used by default in the bookmarkContainer.
 * @param title Bookmark"s title, displayed when hovered
 * @param url Bookmark"s url
 */
const BookmarkElement = ({bookmark}: IBookmark) => {
    const {t} = useTranslation();
    const handleClick = () => {
        if(bookmarkNewTabSetting.value) {
            window.open("https://" + bookmark.url);
        }
        else{
            location.assign("https://" + bookmark.url);
        }
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        let bookmarks = bookmarkListSetting.value;
        bookmarks = bookmarks.filter(
            (element: BookmarkObject) => element.url != bookmark.url
        );
        bookmarkListSetting.value = bookmarks;
    }

    return(
        <div 
            aria-label="bookmark"
            className="bookmark"
            id={bookmark.url}
            title={bookmark.title}
            onClick={handleClick}
        >
            <span
                aria-label="bookmark-delete"
                onClick={handleDelete}
            />
            <img src={bookmark.iconUrl}/>
        </div>
    )
}

/**
 * Displays every bookmark stored, also provides the possibility to add new
 * bookmarks
 */
const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useSetting(bookmarkListSetting);
    const popupOpener = useRef(null);
    const titleInput = useRef(null);
    const urlInput = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    const [isPopupVisible, setIsPopupVisible] = usePopup( 
        <Popup
            popupOpenerRef={popupOpener}
            handleClose={() => {
                setIsPopupVisible(false)
            }}
            className="bookmark-popup"
        >
            <h1>{t("bookmarks-new")}</h1>
            <form action="">
            <div className="bookmark-input-section">
                <input 
                    type="text"
                    placeholder=" "
                    tabIndex={1}
                    autoComplete="off"
                    ref={titleInput}
                />
                <span className="input-background"></span>
                <span className="input-header">
                    {t("bookmarks-new-title")}
                </span>
            </div>

            <div className="bookmark-input-section">
                <input
                    type="text"
                    placeholder=" "
                    tabIndex={1}
                    autoComplete="off"
                    ref={urlInput}
                />
                <span className="input-background"></span>
                <span className="input-header">URL</span>
            </div>
            <ButtonContainer direction="inline" fitMode="fit">
                <Button 
                    callback={(event) => {
                        event.preventDefault();
                        if(urlInput.current.value.length){
                            addBookmark(
                                urlInput.current.value,
                                titleInput.current.value
                            );
                        }
                        setIsPopupVisible(false);
                    }}
                    formAction="sumbit"
                    options={{color:"success", fillMode:"filled"}}>
                    
                    {t("save")}
                </Button>
                <Button 
                    callback={() => {
                        setIsPopupVisible(false);
                    }}
                    options={{color:"danger", fillMode:"outlined"}}>
                    
                    {t("discard")}
                </Button>
            </ButtonContainer>
            </form>
        </Popup>
    , false);

    const addBookmark = (url:string, title:string) => {
        let temp = bookmarkListSetting.value;
        const bookmark = new Bookmark(title, url);

        temp.push({
            "url":bookmark.url,
            "title":bookmark.title
        })

        setBookmarks(temp);
    }   

    return(
        <div aria-label="bookmark-container" id="bookmark-container">
            {bookmarks.map((bookmark: BookmarkObject, index: number) => {
                if(bookmark.url) return <BookmarkElement 
                    bookmark={new Bookmark(bookmark.title, bookmark.url)}
                    key={index}/>
                else return null;
            })}
            <div 
                className="bookmark" 
                id="add-bookmark"
                aria-label="add-bookmark"
                onClick={() => setIsPopupVisible(true)}
                ref={popupOpener}>
                    
                <img 
                    src="./app-ressources/plus-symbol.svg"
                    alt="Add Bookmark"
                />
                
            </div>
        </div>
    ) 
}

const BookmarksOptions = () => {
    const { t } = useTranslation();
    return (
        <Feature
            title={t("bookmarks")}
            desc={t("open-new-page")}
            img={"app-ressources/new-tab-symbol.svg"}
            setting={BookmarksModule.getSetting(
                "bookmark-new-page-boolean"
            )}
        />
        
    )
}

BookmarksModule.settingsSectionElement = <BookmarksOptions/>;
BookmarksModule.rootElement = <Bookmarks/>;

ModulesManager.instance.register(BookmarksModule);

export { BookmarksModule, BookmarkElement, Bookmarks };
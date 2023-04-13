import {render, fireEvent, screen, getByLabelText, getAllByLabelText} from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react";
import { BookmarkElement, Bookmarks, BookmarksModule } from "../Bookmarks";
import { Bookmark } from "../Bookmark";
import { act } from "react-dom/test-utils";

let bookmark: HTMLElement;
let bookmark1: HTMLElement;

const bookmarkListSetting = BookmarksModule
    .getSetting("bookmark-list");

const bookmarkNewTabSetting = BookmarksModule
    .getSetting("bookmark-new-page-boolean");

describe("Testing BookmarkElement class", () => {

    delete window.location;
    const pageChanged = jest.fn();
    const url = "http://dummy.com";
    delete window.open;
    const windowOpened = jest.fn();
    Object.defineProperty(window, "open", { value: windowOpened });
    Object.defineProperty(window, "location", {
        value: {
            href: url,
            assign: pageChanged
        },
        writable: true
    });


    beforeEach(() => {
        render(
            <BookmarkElement bookmark={
                new Bookmark("dummyTitle", "dummy.url")
            }/>
        );
        render(
            <BookmarkElement bookmark={
                new Bookmark("dummyTitle1", "dummy.url1")
            }/>
        );

        bookmark = screen.getAllByLabelText("bookmark")[0];
        bookmark1 = screen.getAllByLabelText("bookmark")[1];
        bookmarkListSetting.value=[{"url": "dummy.url", "title": "dummyTitle"}];
        bookmarkNewTabSetting.value=false;
    })
    test("Properties", () => {
        expect(bookmark.title).toBe("dummyTitle"); 
    });

    test("Clicking", () => {
        fireEvent.click(bookmark);
        expect(pageChanged).toBeCalledWith("https://dummy.url");
    });

    test("Clicking new page", () => {
        bookmarkNewTabSetting.value=true;
        fireEvent.click(bookmark1);
        expect(windowOpened).toBeCalledWith("https://dummy.url1");
    });

    test("Deletion", () => {
        expect(bookmarkListSetting.value.length).toBe(1);
        fireEvent.click(getByLabelText(bookmark, "bookmark-delete"));
        expect(bookmarkListSetting.value.length).toBe(0);
    });

})

let bookmarkContainer: HTMLElement;

describe("Testing Bookmarks class", () => {
    beforeEach(() => {
        bookmarkListSetting.value=[{"url": "dummy.url", "title": "dummyTitle"}];
        render(
            <Bookmarks></Bookmarks>
        );

        bookmarkContainer = screen.getByLabelText("bookmark-container");
    })

    test("Adding bookmark", () => {
        act(() => {
            bookmarkListSetting.value=[
                {"url": "dummy.url", "title": "dummyTitle"},
                {"url": "dummy.url1", "title": "dummyTitle1"}
            ];
        })
        expect(getAllByLabelText(bookmarkContainer, "bookmark").length).toBe(2);
        fireEvent.click(getByLabelText(bookmarkContainer, "add-bookmark"));
    })
})

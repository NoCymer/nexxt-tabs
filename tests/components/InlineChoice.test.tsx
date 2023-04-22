import {render, fireEvent, screen} from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react";
import { InlineChoice, InlineChoiceContainer } from "@Components/basic/InlineChoice";
import { Setting } from "@Settings/Setting";

let dummySetting: Setting<string>;
let dummyCallback: Function;
let choices: HTMLElement;

describe("Testing Choice class", () => {

    beforeEach(() => {
        localStorage.clear();
        dummySetting = new Setting("dummyKey", "false");
        dummyCallback = jest.fn();
        render(
            <InlineChoiceContainer setting={dummySetting} callback={dummyCallback}>
                <InlineChoice 
                    key="1" 
                    text="dummyTxt1"
                    value="dummyVal1"
                />
                <InlineChoice 
                    key="2" 
                    text="dummyTxt2"
                    value="dummyVal2"
                />
            </InlineChoiceContainer>
        );
        choices = screen.getByLabelText("choices");

    })

    test("Number of childs", () => {
        expect(choices.children.length).toBe(2);
        expect(dummyCallback).toHaveBeenCalledTimes(0);
    })

    test("Selecting", () => {
        fireEvent.click(choices.children[0]);
        expect(dummySetting.value).toBe("dummyVal1");
        expect(dummyCallback).toHaveBeenCalledTimes(1);

        fireEvent.click(choices.children[1]);
        expect(dummySetting.value).toBe("dummyVal2");
        expect(dummyCallback).toHaveBeenCalledTimes(2);
    })
})
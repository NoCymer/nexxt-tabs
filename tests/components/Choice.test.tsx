import {render, fireEvent, screen} from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react";
import { Choice, ChoiceContainer } from "Components/basic/Choice";
import { Setting } from "Settings/";

let dummySetting: Setting<string>;
let dummyCallback: Function;
let choices: HTMLElement;

describe("Testing Choice class", () => {

    beforeEach(() => {
        localStorage.clear();
        dummySetting = new Setting("dummyKey", "false");
        dummyCallback = jest.fn();
        render(
            <ChoiceContainer setting={dummySetting} callback={dummyCallback}>
                <Choice 
                    key="1" 
                    img="dummyURL1"
                    text="dummyTxt1"
                    value="dummyVal1"
                />
                <Choice 
                    key="2" 
                    img="dummyURL2"
                    text="dummyTxt2"
                    value="dummyVal2"
                />
            </ChoiceContainer>
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
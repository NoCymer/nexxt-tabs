import {render, fireEvent, screen} from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react";
import { Button, ButtonContainer } from "@Components/basic/Button";

let dummyCallback: Function;
let buttonContainer: HTMLElement;

describe("Testing Button class", () => {

    beforeEach(() => {
        localStorage.clear();
        dummyCallback = jest.fn();
        render(
            <ButtonContainer direction="stacked" fitMode="fit">
                <Button options={
                    {color: "primary", fillMode: "filled"}
                    } callback={dummyCallback}>
                    dummyButton
                </Button>
            </ButtonContainer>
        );
        buttonContainer = screen.getByLabelText("button-container");

    })

    test("Number of childs", () => {
        expect(buttonContainer.children.length).toBe(1);
    })

    test("Clicking", () => {
        fireEvent.click(buttonContainer.children[0]);
        expect(dummyCallback).toHaveBeenCalledTimes(1);
    })
})
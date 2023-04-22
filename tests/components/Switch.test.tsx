import {render, fireEvent, screen} from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react";
import { Setting } from "@Settings/Setting";
import Switch from "@Components/basic/switches/Switch";

let dummySetting: Setting<boolean>;
let dummyCallback: jest.Mock;
let input: HTMLElement;
let isActiveState: boolean;

describe("Testing Switch class", () => {

    beforeEach(() => {
        localStorage.clear();
        isActiveState = false;
        dummyCallback = jest.fn(isActive => {
            isActiveState = isActive;
        });
        render(
            <Switch
                isActive={false}
                onChange={dummyCallback}
                type="dummyType"
            />
        );
        input = screen.getByLabelText("switch-setting");

    })

    test("Enabling", () => {
        expect(dummyCallback).toBeCalledTimes(0);
        expect(input).not.toBeChecked();

        fireEvent.click(input);

        expect(dummyCallback).toBeCalledTimes(1);

        expect(isActiveState).toBe(true);
        expect(input).toBeChecked();
    })

    test("Disabling", () => {
        expect(dummyCallback).toBeCalledTimes(0);

        expect(input).not.toBeChecked();

        fireEvent.click(input);

        expect(input).toBeChecked();

        fireEvent.click(input);

        expect(input).not.toBeChecked();

        expect(isActiveState).toBe(false);

        expect(dummyCallback).toBeCalledTimes(2);
    })
})
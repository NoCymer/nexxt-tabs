import {render, fireEvent, screen, getAllByLabelText} from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react";
import { Feature, FeatureOptionCheckbox } from "@Components/advanced/Feature";
import { Setting } from "@Settings/Setting";

let dummySetting: Setting<boolean>;
let dummySetting1: Setting<boolean>;
let dummySetting2: Setting<boolean>;
let feature: HTMLElement;

describe("Testing Feature class", () => {

    beforeEach(() => {
        localStorage.clear();
        dummySetting = new Setting("dummyKey", false);
        dummySetting1 = new Setting("dummyKey1", false);
        dummySetting2 = new Setting("dummyKey2", false);
        render(
            <Feature
                title="dummyFeature"
                desc="dummyFeatureDesc"
                img="dummyFeatureImgURL"
                setting={dummySetting}
            >
                <FeatureOptionCheckbox 
                    description="dummyFeatureOptionDesc"
                    setting={dummySetting1}
                    img="new-tab"
                />
                <FeatureOptionCheckbox
                    description="dummyFeatureOptionDesc1"
                    setting={dummySetting2}
                />
            </Feature>
        );
        feature = screen.getByLabelText("feature");

    })

    test("Number of childs", () => {
        expect(feature.children[1].children.length).toBe(2);
    });

    test("Enabling feature", () => {
        fireEvent.click(getAllByLabelText(feature, "switch-setting")[0]);
        expect(dummySetting.value).toBe(true);
    });

    test("Enabling option", () => {
        fireEvent.click(getAllByLabelText(feature, "switch-setting")[1]);
        expect(dummySetting1.value).toBe(true);
    });

    test("Disabling feature", () => {
        fireEvent.click(getAllByLabelText(feature, "switch-setting")[0]);
        expect(dummySetting.value).toBe(true);
        fireEvent.click(getAllByLabelText(feature, "switch-setting")[0]);
        expect(dummySetting.value).toBe(false);
    });
})
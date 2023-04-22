import { Module } from "@Modules/base/Module";
import { I18nextProvider } from 'react-i18next';
import React from "react";

describe("Testing Module class", () => {
    let dummyModuleJSON = {
        "name": "DummyModule",
        "title": "DummyTitle",
        "desc": "descriptionDM",
        "iconURL": "dummyURL",
        "status-setting" : {
            "key": "DummyModule-activated-boolean",
            "defaultValue": true
        },
        "settings" : {
            "dummySetting-test-setting" : {
                "defaultValue": true
            }
        }
    }
    
    let dummyModule1JSON = {
        "name": "DummyModule1",
        "title": "DummyTitle1",
        "desc": "descriptionDM1",
        "iconURL": "dummyURL1",
        "status-setting" : {
            "key": "DummyModule1-activated-boolean",
            "defaultValue": true
        },
        "settings" : {
            "dummySetting1-test-setting" : {
                "defaultValue": true
            }
        }
    }

    const onEnableDummy = jest.fn();

    const onDisableDummy = jest.fn();

    const dummyModule = new Module(
        dummyModuleJSON,
        onEnableDummy,
        onDisableDummy
    );
    const dummyModule1 = new Module(
        dummyModule1JSON
    );

    test("Module infos", () => {
        expect(
            dummyModule.name
        ).toBe("DummyModule");

        expect(
            dummyModule.desc
        ).toBe("descriptionDM");

        expect(
            dummyModule.iconURL
        ).toBe("dummyURL");

        expect(
            dummyModule.title
        ).toBe("DummyTitle");
    });

    test("Getting Setting", () => {
        expect(
            dummyModule.getSetting("dummySetting-test-setting").value
        ).toBe(true);
    });

    test("Setting/Getting DOM Elements", () => {
        dummyModule.rootElement = <div>dummyRoot</div>
        dummyModule.settingsSectionElement = <div>dummySettingSection</div>
        expect(
            dummyModule.rootElement
        ).toStrictEqual(<div>dummyRoot</div>);
        expect(
            dummyModule.settingsSectionElement
        ).toStrictEqual(<div>dummySettingSection</div>);
    });

    test("Disabling", () => {
        dummyModule.disable();
        expect(
            onDisableDummy
        ).toHaveBeenCalledTimes(1);

        dummyModule1.disable();
        expect(
            dummyModule1.enabledSetting.value
        ).toBe(false);
    });

    test("Enabling", () => {
        dummyModule.enable();
        expect(
            onEnableDummy
        ).toHaveBeenCalledTimes(2);

        dummyModule1.enable();
        expect(
            dummyModule1.isEnabled()
        ).toBe(true);
    });
})
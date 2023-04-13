import { ModulesManager, Module, ModulesSettingsTabContent } from "Modules/base";
import {render, fireEvent, screen, getByLabelText, getAllByLabelText} from "@testing-library/react"
import React from "react";
import { act } from "react-dom/test-utils";

const dummyModuleJSON = {
    "name": "DummyModule",
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

const dummyModule1JSON = {
    "name": "DummyModule1",
    "desc": "descriptionDM1",
    "iconURL": "dummyURL1",
    "status-setting" : {
        "key": "DummyModule1-activated-boolean",
        "defaultValue": false
    },
    "settings" : {
        "dummySetting1-test-setting" : {
            "defaultValue": true
        }
    }
}

describe("Testing ModulesManager class ", () => {

    const onModuleChangeDummy = jest.fn();

    const dummyModuleManager = ModulesManager.instance;
    
    dummyModuleManager.subscribe(onModuleChangeDummy);
    
    const dummyModule = new Module(
        dummyModuleJSON
    );
    const dummyModule1 = new Module(
        dummyModule1JSON
    );

    beforeEach(() => {
        render(<ModulesSettingsTabContent/>)
    })

    test("Registering module", () => {
        dummyModuleManager.register(dummyModule);

        expect(dummyModuleManager.enabledModules).toContain(
            dummyModule
        );
        dummyModuleManager.register(dummyModule1);
        expect(dummyModuleManager.enabledModules.length).toBe(1);
        expect(onModuleChangeDummy).toHaveBeenCalledTimes(
            0
        );
    })

    test("Enabling module", () => {
        dummyModuleManager.register(dummyModule);
        dummyModuleManager.register(dummyModule1);
        expect(dummyModuleManager.enabledModules).toContain(
            dummyModule
        );
        expect(dummyModuleManager.enabledModules.length).toBe(1);
           
        act(() => dummyModule1.enable());

        expect(onModuleChangeDummy).toHaveBeenCalledTimes(
            1
        );

        expect(dummyModuleManager.enabledModules).toContain(
            dummyModule
        );
        expect(dummyModuleManager.enabledModules).toContain(
            dummyModule1
        );
        expect(dummyModuleManager.enabledModules.length).toBe(2);
    })

    test("Disabling module", () => {
        dummyModuleManager.register(dummyModule);
        dummyModuleManager.register(dummyModule1);
        act(() => dummyModule1.enable());
        expect(dummyModuleManager.enabledModules).toContain(
            dummyModule
        );
        expect(dummyModuleManager.enabledModules).toContain(
            dummyModule1
        );
        expect(dummyModuleManager.enabledModules.length).toBe(2);

        act(() => dummyModule.disable());

        expect(onModuleChangeDummy).toHaveBeenCalledTimes(
            2
        );

        expect(dummyModuleManager.enabledModules).toContain(
            dummyModule1
        );
        expect(dummyModuleManager.enabledModules.length).toBe(1);
    })

    test("Getting modules", () => {
        dummyModuleManager.register(dummyModule);
        dummyModuleManager.register(dummyModule1);
        expect(dummyModuleManager.modules).toContain(
            dummyModule
        );
        expect(dummyModuleManager.modules).toContain(
            dummyModule1
        );
        expect(dummyModuleManager.modules.length).toBe(2);
    })

    test("Getting Settings Page", () => {
        dummyModuleManager.register(dummyModule);
        dummyModuleManager.register(dummyModule1);
        expect(screen.getByLabelText(
            "modules-settings-tab-content"
        ).children.length).toBe(3);
    })
})
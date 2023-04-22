import { SettingsManager } from "@Settings/SettingsManager";

let dummyJSON = {
    "dummy-key" : {
        "defaultValue": "dummyValue"
    }
}

describe("Testing SettingsManager class", () => {
    let settingManager = new SettingsManager(dummyJSON);

    test("Getting", () => {
        expect(settingManager.getSetting("dummy-key").value).toBe("dummyValue");
    });

    test("Error Getting", () => {
        expect(() => settingManager.getSetting("dummy-key1").value)
        .toThrow("Setting does not exist");
    });
})
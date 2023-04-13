import { Setting } from "../src/settings/Setting";

describe("Testing Setting class", () => {
    let dummySetting: Setting<number>;

    beforeEach(() => {
        dummySetting = new Setting("dummySetting", 5);
        dummySetting.value = 5;
    });

    test("Error on creating", () => {
        expect(() =>
            new Setting("dummySetting1", undefined)
        ).toThrow("Default value must not be undefined");
    });

    test("Getting", () => {
        expect(dummySetting.value).toBe(5);
    });

    test("Setting", () => {
        dummySetting.value = 3;
        expect(dummySetting.value).toBe(3);
    });

    test("OnChange", () => {
        let test = 0;
        dummySetting.subscribe((value) => test = value);

        dummySetting.value = 1;

        expect(test).toBe(1);
    });
})
const appManager = (lang = "en-US") => {
    localStorage.clear();
    Object.defineProperty(global.navigator, "language", {
        value: lang,
        configurable: true
    });  
    return require("../src/AppManager").default;
}

describe("Testing SettingsManager class", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test("Getting default", () => {
        expect(
            appManager().getSetting("language-string").value
        ).toBe("en");
    });
    
    test("Getting supported", () => {
        expect(
            appManager("fr-FR").getSetting("language-string").value
        ).toBe("fr");
    });

    test("Getting unsupported", () => {
        expect(
            appManager("az-AZ").getSetting("language-string").value
        ).toBe("en");
    });

    test("Error Getting", () => {
        expect(() => appManager().getSetting("dummy-key1").value)
        .toThrow("Setting does not exist");
    });
})
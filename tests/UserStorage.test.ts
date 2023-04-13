import UserStorage from "../src/UserStorage";

describe("Testing UserStorage class", () => {
    let dummyStorage: UserStorage<string>;

    beforeEach(() => {
        dummyStorage = new UserStorage("dummyStorageKey", "dummyValue");
        dummyStorage.value = "dummyValue";
    });

    test("Error on creating", () => {
        expect(() =>
            new UserStorage("dummyStorageKey1", undefined)
        ).toThrow("Default value must not be undefined");
    });

    test("Error on parsing", () => {
        expect(
            new UserStorage("dummyStorageKey2", "1.1\"}").value
        ).toBe("1.1\"}");
    });

    test("Creating", () => {
        expect(
            new UserStorage("dummyStorageKey3", "dummyValue1").value
        ).toBe("dummyValue1");
    });

    test("Getting", () => {
        expect(dummyStorage.value).toBe("dummyValue");
    });

    test("Setting", () => {
        dummyStorage.value = "dummyValue2";
        expect(dummyStorage.value).toBe("dummyValue2");
    });

    test("OnChange", () => {
        let test = 0;
        dummyStorage.subscribe((value) => test = value);

        dummyStorage.value = 1;

        expect(test).toBe(1);
    });
})
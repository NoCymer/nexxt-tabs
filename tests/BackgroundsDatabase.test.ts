import backgroundsDB from '../src/BackgroundsDatabase';

describe("Testing BackgroundDatabase class", () => {
    test("Storing & Fetching", async () => {
        await backgroundsDB.storeBackground("0", "dummy");
        await backgroundsDB.storeBackground("1", "test1");
        expect(await backgroundsDB.fetchBackground("1")).toBe("test1");
    })
    test("FetchAll", async () => {
        expect(await backgroundsDB.fetchIds()).toStrictEqual(["0","1"]);
    })
    test("Deleting", async () => {
        await backgroundsDB.deleteBackground("1");
        expect(await backgroundsDB.fetchIds()).toStrictEqual(["0"]);
    })
})
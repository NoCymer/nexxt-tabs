import backgroundsDB from '../src/BackgroundsDatabase';

describe("Testing BackgroundDatabase class", () => {
    test("FetchAll", async () => {
        expect(await backgroundsDB.fetchIds()).toStrictEqual(["0","1"]);
    })
    test("Deleting", async () => {
        await backgroundsDB.deleteBackground("1");
        expect(await backgroundsDB.fetchIds()).toStrictEqual(["0"]);
    })
})
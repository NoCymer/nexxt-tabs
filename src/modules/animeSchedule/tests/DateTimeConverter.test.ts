import DateTimeConverter from "../DateTimeConverter";

describe("Testing DateTimeConverter class", () => {
    let dummyDate = new Date(Date.now());
    dummyDate.setHours(6);
    dummyDate.setMinutes(0);

    test("Int to String day", () => {
        expect(DateTimeConverter.dayIntToString(0)).toBe("Sundays");
        expect(DateTimeConverter.dayIntToString(6)).toBe("Saturdays");
    })

    test("String to Int day", () => {
        expect(DateTimeConverter.dayStrToInt("Sundays")).toBe(0);
        expect(DateTimeConverter.dayStrToInt("Saturdays")).toBe(6);
    })

    test("Get day in week", () => {
        expect(DateTimeConverter.getCurrentWeekDateTime(
            6,
            "00:00",
            "UTC+9"
        ).getDay()).toBe(5);
    })
})
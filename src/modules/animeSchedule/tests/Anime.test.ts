import Anime from "../Anime";
import DateTimeConverter from "../DateTimeConverter";

/**
 * Strips spaces from a string and returns it 
 * @param str String to process
 * @returns String without any space
 */
const stripSpaces = (str: string) => {
    return str.replace(/\s/g, '');
}

describe("Testing anime class", () => {
    let dummyDate = new Date(Date.now());
    dummyDate.setHours(6);
    dummyDate.setMinutes(0);
    let dummyAnime = new Anime(
        0,
        "dummyTitle",
        "dummySynopsis",
        "dummyThumbnailURL",
        "dummyMalURL",
        dummyDate
    );

    test("Quarter calculation", () => {
        expect(dummyAnime.quarter).toBe(3);
    })

    test("Release day", () => {
        expect(dummyAnime.weeklyReleaseDay).toBe(dummyDate.getDay());
    })

    test("Release string", () => {
        expect(dummyAnime.weeklyReleaseDayString).toBe(
            DateTimeConverter.dayIntToString(dummyDate.getDay())
        );
    })
    
    test("Release time 12", () => {
        expect(stripSpaces(dummyAnime.weeklyReleaseTime12)).toBe("06:00AM");
    })
    
    test("Release time 24", () => {
        expect(dummyAnime.weeklyReleaseTime24).toBe("06:00");
    })

    let dummyAnime2 = Anime.fromJSON(
        {
            "_id": 1234,
            "_title": "dummyTitle",
            "_synopsis": "dummySynopsis",
            "_thumbnailURL": "dummyThumbnailURL",
            "_malURL": "dummyMalURL",
            "_nextReleaseDate": "2000-01-01T00:00:00.000Z"
        }
    );

    test("JSON Parsing", () => {
        expect(dummyAnime2.id).toBe(1234);
        expect(dummyAnime2.title).toBe("dummyTitle");
        expect(dummyAnime2.synopsis).toBe("dummySynopsis");
        expect(dummyAnime2.thumbnailURL).toBe("dummyThumbnailURL");
        expect(dummyAnime2.malURL).toBe("dummyMalURL");
        expect(dummyAnime2.weeklyReleaseDay).toBe(6);
    })
})
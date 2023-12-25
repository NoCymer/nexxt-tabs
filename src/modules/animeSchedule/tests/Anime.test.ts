import Anime from "../Anime";
import DateTimeConverter from "../DateTimeConverter";
import { isCacheValid, validateCache } from "../AnimeSchedule";

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

    test("Cache invalidation", () => {
        const dummyShouldBeValid = {
            "_id": 0,
            "_title": "",
            "_synopsis": "",
            "_thumbnailURL": "",
            "_malURL": "",
            "_nextReleaseDate": "",
            "_quarter": 0
        }
        const dummyShouldBeValid1 = {
            "_id": 56,
            "_title": "test1",
            "_synopsis": "test2",
            "_thumbnailURL": "abc.png",
            "_malURL": "test3",
            "_nextReleaseDate": "2019-11-03",
            "_quarter": 2
        }
        const dummyShouldBeInValid = {
            "_id": 0,
            "_title": "",
            "_synopsis": "",
            "_thumbnailURL": "",
            "_nextReleaseDate": "",
            "_quarter": 0
        }
        const dummyArrayInvalid = [dummyShouldBeValid, dummyShouldBeInValid];
        const dummyArrayValid = [dummyShouldBeValid, dummyShouldBeValid1];
        expect(isCacheValid(dummyArrayInvalid)).toBe(false);
        expect(isCacheValid(dummyArrayValid)).toBe(true);
    })

    test ("Cache validation", () => {
        const dummyShouldBeValid = {
            "_id": 0,
            "_title": "",
            "_synopsis": "",
            "_thumbnailURL": "",
            "_malURL": "",
            "_nextReleaseDate": "",
            "_quarter": 0
        }
        const dummyShouldBeInValid = {
            "_id": 0,
            "_title": "",
            "_synopsis": "",
            "_thumbnailURL": "",
            "_nextReleaseDate": "",
            "_quarter": 0
        }
        let dummyArrayInvalid = [dummyShouldBeValid, dummyShouldBeInValid];
        dummyArrayInvalid = validateCache(dummyArrayInvalid);
        expect(dummyArrayInvalid).toStrictEqual([{}]);
    })

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
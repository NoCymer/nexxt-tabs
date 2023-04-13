import { Bookmark } from "../Bookmark";

describe("Testing Bookmark class", () =>  {
    const bookmark = new Bookmark("dummyTitle" ,"https://www.test.com/test/");
    const bookmark1 = new Bookmark("dummyTitle1" ,"test.com/test");
    const bookmark2 = new Bookmark("dummyTitle2" ,"www.test.com/test");
    const bookmark3 = new Bookmark("dummyTitle3" ,"www.test.com");
    const bookmark4 = Bookmark.fromJSON({
        "url" : "https://www.test.com/test/",
        "title" : "dummyTitle4"
    });

    test("Testing icon url", () => {
        expect(bookmark.iconUrl).toBe(
            "https://icons.duckduckgo.com/ip3/test.com.ico"
        );
        expect(bookmark1.iconUrl).toBe(
            "https://icons.duckduckgo.com/ip3/test.com.ico"
        );
        expect(bookmark2.iconUrl).toBe(
            "https://icons.duckduckgo.com/ip3/test.com.ico"
        );
        expect(bookmark3.iconUrl).toBe(
            "https://icons.duckduckgo.com/ip3/test.com.ico"
        );
        expect(bookmark4.iconUrl).toBe(
            "https://icons.duckduckgo.com/ip3/test.com.ico"
        );
    })

    test("Testing properties", () => {
        expect(bookmark.title).toBe(
            "dummyTitle"
        );
        expect(bookmark.url).toBe(
            "test.com/test"
        );
        expect(bookmark4.title).toBe(
            "dummyTitle4"
        );
        expect(bookmark4.url).toBe(
            "test.com/test"
        );
    })
}) 
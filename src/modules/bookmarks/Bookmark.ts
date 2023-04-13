/** Class used to represent a bookmark */
export class Bookmark{
    /** Regex expression for converting urls
     *  from www.yyy.com/www/zzz to yyy.com/www/zzz
     */
    private readonly REGEX_WWW_URL = /www\.(.+)/;

    /** Regex expression for converting urls 
     * from https://www.yyy.zzz/aaa to www.yyy.zzz/aaa
     */
    private readonly REGEX_URL = /[A-z]+:\/\/(w{3}\.)?([\W\w]+)/;

    /** Regex expression for converting urls from yyy.com/www/zzz to yyy.com */
    private readonly REGEX_SIMPLIFY_URL = /(.+?(?=\/))/;

    /** Url of the icon getter for bookmarks */
    private readonly ICON_SOURCE_URL = "https://icons.duckduckgo.com/ip3/";

    /** Title of the bookmark */
    private _title = "";

    /** Url of the bookmark */
    private _url = "";

    /**
     * Creates a bookmark
     * @param title 
     * @param url 
     */
    constructor(title: string, url: string)  {
        this._title = title;
        this._url = this.parseUrl(url);
    }

    /**
     * Parses an url by removing "https://", "www." and ending "/" from
     * the url
     * @param url URL To parse
     * @returns Parsed URL
     */
    private parseUrl = (url: string) => {
        url = url.trim();
        if (url.includes("http")) {
            url = url.match(this.REGEX_URL)[2];
        }
        let char = url.charAt(url.length - 1);
        if (char == "/") {
            url = url.substring(0, url.length - 1);
        }
        try { url = url.match(this.REGEX_WWW_URL)[1]; } catch {}
    
        return url;
    }

    /** Title of the bookmark */
    public get title() {
        return this._title;
    }

    /** Url of the bookmark */
    public get url() {
        return this._url;
    }

    /** Url of the bookmark's icon */
    public get iconUrl() {
        //Converts the url of kind : yyy.com/www/zzz to yyy.com
        let urlIMG: string;
        try { urlIMG = this._url.match(this.REGEX_SIMPLIFY_URL)[1] ;} 
        catch { urlIMG = this._url; }
        return this.ICON_SOURCE_URL + urlIMG.toLowerCase() + ".ico";
    }
    
    /**
     * Converts a json file to a bookmark object
     * @param obj Json object to convert
     * @returns Bookmark object corresponding to json
     */
    public static fromJSON(obj: Object): Bookmark {
        return new Bookmark(obj["title"], obj["url"]);
    }
}
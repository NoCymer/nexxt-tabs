import DateTimeConverter from "./DateTimeConverter";
/** Represents an anime and info on its weekly release */
export default class Anime{
    private static readonly TIME_REGEX = /(\d+)/;
    /** Id of the anime on the mal website */
    private _id: number;
    /** Title of the anime */
    private _title: string;
    /** Synopsis of the anime */
    private _synopsis: string;
    /** URL of the anime"s thumbnail */
    private _thumbnailURL: string;
    /** URL pointing to the anime"s my anime liste page */
    private _malURL: string;
    /** Date in the week of the next anime episode"s release */
    private _nextReleaseDate: Date;

    private _quarter: number;

    constructor(
        id: number,
        title: string,
        synopsis: string,
        thumbnailURL: string,
        malURL: string,
        nextReleaseDate: Date) {
        this._id = id;
        this._title = title;
        this._synopsis = synopsis;
        this._malURL = malURL;
        this._thumbnailURL = thumbnailURL;
        this._nextReleaseDate = nextReleaseDate;
        this._quarter = Anime.calculateQuarter(this.weeklyReleaseTime24);

    }

    /**
     * @param time Time of the day
     * @returns Quarter of the day
     */
    private static calculateQuarter(time: string): number {
        let matches = time.match(Anime.TIME_REGEX);
        return Math.floor(
            Number(matches[0]) / 3
        ) + 1;
    }

    public get id(): number {
        return this._id;
    }
    public get title(): string {
        return this._title;
    }
    public get synopsis(): string {
        return this._synopsis;
    }
    public get thumbnailURL(): string {
        return this._thumbnailURL;
    }
    public get malURL(): string {
        return this._malURL;
    }
    public get weeklyReleaseDay(): number {
        return this._nextReleaseDate.getDay();
    }
    public get weeklyReleaseDayString(): string {
        return DateTimeConverter.dayIntToString(this._nextReleaseDate.getDay());
    }
    public get weeklyReleaseTime12(): string {
        return this._nextReleaseDate.toLocaleString(
            [],
            { 
                hour: "2-digit", 
                minute:"2-digit", 
                hourCycle: "h12" 
            }
        );
    }
    public get weeklyReleaseTime24(): string {
        return this._nextReleaseDate.toLocaleString(
            [],
            {
                hour: "2-digit",
                minute:"2-digit",
                hourCycle: "h23"
            }
        );;
    }   
    public get quarter(): number {
        return this._quarter;
    }  
    
    /**
     * Creates an anime from a json object
     * @param obj json object to parse
     * @returns Anime corresponding to the json object
     */
    public static fromJSON(obj: Object): Anime {
        return new Anime(
            obj["_id"],
            obj["_title"],
            obj["_synopsis"],
            obj["_thumbnailURL"],
            obj["_malURL"],
            new Date(obj["_nextReleaseDate"])
        );
    }
} 
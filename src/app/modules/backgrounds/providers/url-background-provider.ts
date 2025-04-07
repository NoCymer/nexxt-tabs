import { AbstractBackgroundProvider } from "./abstract-background-provider";

export default class UrlBackgroundProvider extends AbstractBackgroundProvider {
    private _currentFrame: HTMLImageElement = new Image();
    private _url: string = 'https://pic.re/image';
    private _fetchIntervalMs: number = 5000;
    private _lastFetchTimestamp: number = 0;

    constructor() {
        super();
        this.fetch();
    }

    public async nextFrame(): Promise<HTMLImageElement> {
        if (Date.now() > this._lastFetchTimestamp + this._fetchIntervalMs)
            this.fetch();
        return this._currentFrame;
    }

    private fetch() {
        this._currentFrame.src = `${this._url}?${new Date().getTime()}`;
        this._lastFetchTimestamp = Date.now();
    }
}

export const urlBackgroundProvider = new UrlBackgroundProvider();
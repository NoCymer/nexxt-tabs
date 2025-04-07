import { db } from "../background-database";
import { AbstractBackgroundProvider } from "./abstract-background-provider";

export class StoredBackgroundProvider extends AbstractBackgroundProvider {
    private _currentFrame: HTMLImageElement = new Image();

    private _sourcesIds: number[] = [];
    private _sourcesIdsHistoryBuffer: number[] = [];
    private _sourcesIdsHistoryBufferSize: number = 5;

    private _currentSource?: string;
    private _currentSourceType?: 'image' | 'video';

    private _sourceSwitchIntervalMs: number = 10000; // 10 seconds
    private _lastSourceSwitchTimestamp: number = 0;

    constructor() {
        super();
        this.fetchSourcesIds();
    }

    public async nextFrame(): Promise<HTMLImageElement> {
        if (Date.now() > this._lastSourceSwitchTimestamp + this._sourceSwitchIntervalMs)
            this.nextSource();

        return this._currentFrame;
    }

    private async nextSource() {
        let newSourceId: number = 0;

        this.registerSourceIntoHistoryBuffer(newSourceId);
    }

    private registerSourceIntoHistoryBuffer(id: number) {
        if (this._sourcesIdsHistoryBuffer.length == this._sourcesIdsHistoryBufferSize)
            this._sourcesIdsHistoryBuffer.pop();
        this._sourcesIdsHistoryBuffer.unshift(id);
    }

    private async fetchSourcesIds() {
        this._sourcesIds = (await db.backgrounds.toArray()).map(entity => entity.id!);
    }
}

export const storedBackgroundProvider = new StoredBackgroundProvider();
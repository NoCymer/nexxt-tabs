import { Injectable } from '@angular/core';
import { db } from '../background-database';
import { AbstractBackgroundProvider } from './abstract-background-provider-service';
import { BackgroundProviderTimerService } from './background-provider-timer-service';
import { VideoFrameExtractor } from './video-frame-extractor-service';
import Background from '../models/background';

@Injectable({
    providedIn: 'root',
})
export class StoredBackgroundProviderService extends AbstractBackgroundProvider {
    private _currentFrame: HTMLImageElement = new Image();
    private _videoExtractor?: VideoFrameExtractor;
    private _isVideo = false;

    private _sourcesIds: number[] = [];
    private _sourcesIdsHistoryBuffer: number[] = [];
    private _sourcesIdsHistoryBufferSize = 5;

    private _currentSourceUrl?: string;

    constructor(private _bgProviderTimer: BackgroundProviderTimerService) {
        super();
        this.fetchSourcesIds();
    }

    public async nextFrame(): Promise<HTMLImageElement> {
        if (this._bgProviderTimer.requiresSourceSwitch()) {
            this._bgProviderTimer.registerSwitch();
            await this.nextSource();
        }

        if (this._isVideo && this._videoExtractor) {
            return await this._videoExtractor.nextFrame();
        } else {
            return this._currentFrame;
        }
    }

    private async nextSource() {
        const available = this._sourcesIds.filter(
            (id) => !this._sourcesIdsHistoryBuffer.includes(id)
        );
        const newSourceId = available.length
            ? available[Math.floor(Math.random() * available.length)]
            : this._sourcesIds[
                  Math.floor(Math.random() * this._sourcesIds.length)
              ];

        this.registerSourceIntoHistoryBuffer(newSourceId);

        const entity: Background | undefined = await db.backgrounds.get(
            newSourceId
        );
        if (!entity || !entity.blob) return;

        // Revoke previous object URL if any
        if (this._currentSourceUrl) {
            URL.revokeObjectURL(this._currentSourceUrl);
            this._currentSourceUrl = undefined;
        }

        // Create object URL from blob
        this._currentSourceUrl = URL.createObjectURL(entity.blob);

        // Detect if video
        this._isVideo = this.isVideoSource(entity.blob);

        if (this._isVideo) {
            this._videoExtractor = new VideoFrameExtractor(
                this._currentSourceUrl
            );
        } else {
            this._currentFrame = new Image();
            this._currentFrame.src = this._currentSourceUrl;
            this._videoExtractor = undefined;
        }
    }

    private registerSourceIntoHistoryBuffer(id: number) {
        if (
            this._sourcesIdsHistoryBuffer.length ===
            this._sourcesIdsHistoryBufferSize
        )
            this._sourcesIdsHistoryBuffer.pop();
        this._sourcesIdsHistoryBuffer.unshift(id);
    }

    private async fetchSourcesIds() {
        this._sourcesIds = (await db.backgrounds.toArray()).map(
            (entity) => entity.id!
        );
    }

    private isVideoSource(blob: Blob): boolean {
        return blob.type.startsWith('video/');
    }
}

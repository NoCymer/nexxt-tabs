import { Injectable } from '@angular/core';
import { AbstractBackgroundProvider } from './abstract-background-provider-service';
import { BackgroundProviderTimerService } from './background-provider-timer-service';
import { VideoFrameExtractor } from './video-frame-extractor-service';

@Injectable({
    providedIn: 'root',
})
export default class UrlBackgroundProviderService extends AbstractBackgroundProvider {
    private _currentFrame: HTMLImageElement = new Image();
    private _videoExtractor?: VideoFrameExtractor;
    private _isVideo = false;

    private _url: string = 'https://pic.re/image';

    constructor(private _bgProviderTimer: BackgroundProviderTimerService) {
        super();
        this.fetch();
    }

    public async nextFrame(): Promise<HTMLImageElement> {
        if (this._bgProviderTimer.requiresSourceSwitch()) {
            this._bgProviderTimer.registerSwitch();
            this.fetch();
        }

        if (this._isVideo && this._videoExtractor) {
            return await this._videoExtractor.nextFrame();
        } else {
            return this._currentFrame;
        }
    }

    private fetch() {
        const src = `${this._url}?${Date.now()}`;
        this._isVideo = this.isVideoSource(src);

        if (this._isVideo) {
            this._videoExtractor = new VideoFrameExtractor(src);
        } else {
            this._currentFrame = new Image();
            this._currentFrame.src = src;
            this._videoExtractor = undefined;
        }
    }

    private isVideoSource(url: string): boolean {
        return /\.(mp4|webm|ogg)$/i.test(url);
    }
}

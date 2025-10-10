export class VideoFrameExtractor {
    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private nextFramePromise?: {
        resolve: (img: HTMLImageElement) => void;
        reject: (err: any) => void;
    };

    constructor(videoSrc: string) {
        this.video = document.createElement('video');
        this.video.src = videoSrc;
        this.video.crossOrigin = 'anonymous';
        this.video.preload = 'auto';
        this.video.muted = true;
        this.video.playsInline = true;

        this.canvas = document.createElement('canvas');
        const ctx = this.canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas context');
        this.ctx = ctx;

        this.video.addEventListener('loadedmetadata', () => {
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
        });

        // Start playing automatically when ready
        this.video.addEventListener('canplay', () => {
            this.video
                .play()
                .catch((err) => console.warn('Autoplay blocked:', err));
        });

        // Start listening for frames
        this.video.requestVideoFrameCallback(this.handleVideoFrame.bind(this));
    }

    private handleVideoFrame() {
        if (this.nextFramePromise) {
            // Draw the current frame
            this.ctx.drawImage(this.video, 0, 0);
            const img = new Image();
            img.src = this.canvas.toDataURL('image/png');
            this.nextFramePromise.resolve(img);
            this.nextFramePromise = undefined;
        }

        // Continue listening for the next frame
        this.video.requestVideoFrameCallback(this.handleVideoFrame.bind(this));
    }

    public async nextFrame(): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            this.nextFramePromise = { resolve, reject };
        });
    }

    public reset(): void {
        this.video.currentTime = 0;
        this.video.play();
    }
}

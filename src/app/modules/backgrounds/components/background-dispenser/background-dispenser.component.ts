import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild,
} from '@angular/core';
import { AbstractBackgroundProvider } from '../../providers/abstract-background-provider-service';
import { StoredBackgroundProviderService } from '../../providers/stored-background-provider-service';
import UrlBackgroundProviderService from '../../providers/url-background-provider-service';

@Component({
    selector: 'app-background-dispenser',
    imports: [],
    templateUrl: './background-dispenser.component.html',
    styleUrl: './background-dispenser.component.scss',
})
export class BackgroundDispenserComponent implements AfterViewInit {
    @ViewChild('backgroundTarget')
    private _backgroundTarget!: ElementRef<HTMLCanvasElement>;

    private _ctx!: CanvasRenderingContext2D;
    private _canvas!: HTMLCanvasElement;

    private activeProvider!: AbstractBackgroundProvider;

    constructor(
        private _storedBackgroundProvider: StoredBackgroundProviderService,
        private _urlBackgroundProvider: UrlBackgroundProviderService
    ) {
        this.activeProvider = this._urlBackgroundProvider;
    }

    ngAfterViewInit(): void {
        let canvas = this._backgroundTarget.nativeElement;
        let ctx = canvas.getContext('2d');
        if (!ctx || !canvas) return;
        this._ctx = ctx;
        this._canvas = canvas;

        this.fitCanvasToScreenSize();
        this.update();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.fitCanvasToScreenSize();
    }

    private async update() {
        await this.renderScene();
        requestAnimationFrame(async () => await this.update());
    }

    private async renderScene() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this.drawImageFit(await this.activeProvider.nextFrame());
    }

    private drawImageFit(img: HTMLImageElement) {
        let factor = Math.max(
            this._canvas.width / img.width,
            this._canvas.height / img.height
        );
        let scaledWidth = img.width * factor;
        let scaledHeight = img.height * factor;
        let x = this._canvas.width / 2 - scaledWidth / 2;
        let y = this._canvas.height / 2 - scaledHeight / 2;
        this._ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    }

    private fitCanvasToScreenSize() {
        const dpr = window.devicePixelRatio;
        const rect = this._canvas.getBoundingClientRect();
        this._canvas.width = rect.width * dpr;
        this._canvas.height = rect.height * dpr;
        this._ctx.scale(dpr, dpr);
        this._ctx.setTransform();
    }
}

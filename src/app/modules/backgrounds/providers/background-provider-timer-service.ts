import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class BackgroundProviderTimerService {
    private _intervalMs: number = 10000; // 10 seconds
    private _lastSwitchTimestamp: number = 0;
    public requiresSourceSwitch() {
        return Date.now() > this._lastSwitchTimestamp + this._intervalMs;
    }
    public registerSwitch() {
        this._lastSwitchTimestamp = new Date().getTime();
    }
}

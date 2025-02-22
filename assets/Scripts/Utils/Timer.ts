export class Timer {
    // start
    public start() {
        this._start = Date.now();
        this._end = this._start;
        this._running = true;
    }

    public tryStart() {
        if (!this._running) {
            this.start();
        }
    }

    public stop() {
        this._end = Date.now();
        this._running = false;
    }

    private _start: number;
    private _end: number;

    private _running: boolean = false;

    public isRunning() {
        return this._running;
    }

    public getSecStr() {
        return ((this._end - this._start) / 1000).toFixed(3) + ' s';
    }
}

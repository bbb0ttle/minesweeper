export class Timer {
    // start
    public start() {
        this._start = Date.now();
        this._end = this._start;
    }

    public stop() {
        this._end = Date.now();
    }

    private _start: number;
    private _end: number;

    public getSecStr() {
        return ((this._end - this._start) / 1000).toFixed(3) + ' s';
    }
}
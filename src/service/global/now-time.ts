import { NowTimeBase } from '../../contract';

export class DateNowTime extends NowTimeBase {
    public async unix() {
        return Math.floor(
            Date.now() / 1000
        );
    }

    public async unixNano() {
        return Date.now() * 1000000;
    }
}
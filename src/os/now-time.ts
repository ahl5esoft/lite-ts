import { NowTimeBase } from '../time';

export class OSNowTime extends NowTimeBase {
    public async unix(): Promise<number> {
        return Math.floor(
            Date.now() / 1000
        );
    }

    public async unixNano(): Promise<number> {
        return Date.now() * 1000000;
    }
}
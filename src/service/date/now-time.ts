import { NowTimeBase } from '../../contract';

/**
 * Date实现
 */
export class DateNowTime extends NowTimeBase {
    /**
     * @returns 时间戳(单位: s)
     */
    public async unix() {
        return Math.floor(
            Date.now() / 1000
        );
    }

    /**
     * @returns 时间戳(单位: 纳秒)
     */
    public async unixNano() {
        return Date.now() * 1000000;
    }
}
import moment from 'moment';

import { NowTimeBase } from '../../contract';

/**
 * Date实现
 */
export class DateNowTime extends NowTimeBase {
    public async isSameDayUnix(unixTime: number) {
        const nowUnix = await this.unix();
        return moment.unix(nowUnix).isSame(
            moment.unix(unixTime),
            'day'
        );
    }

    public async unix() {
        return Math.floor(
            Date.now() / 1000
        );
    }

    public async unixNano() {
        return Date.now() * 1000000;
    }
}
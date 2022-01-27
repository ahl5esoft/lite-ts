import { strictEqual } from 'assert';
import moment from 'moment';

import { DateNowTime as Self } from './now-time';

describe('src/service/date/now-time.ts', () => {
    describe('.isSameDayUnix(unixTime: number)', () => {
        it('ok', async () => {
            const endDayUnix = moment().endOf('day').unix();
            const res = await new Self().isSameDayUnix(endDayUnix);
            strictEqual(res, true);
        });

        it('不同天', async () => {
            const endDayUnix = moment().endOf('day').unix();
            const res = await new Self().isSameDayUnix(endDayUnix + 1);
            strictEqual(res, false);
        });
    });
});
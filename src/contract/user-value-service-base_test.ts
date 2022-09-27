import { deepStrictEqual, strictEqual } from 'assert';
import moment from 'moment';

import { NowTimeBase } from './now-time-base';
import { UserServiceBase } from './user-service-base';
import { UserValueServiceBase } from './user-value-service-base';
import { global } from '../model';
import { Mock, SetTimeoutThread } from '../service';

class Self extends UserValueServiceBase {
    public get entry() {
        return Promise.resolve(this.m_Entry);
    }

    public constructor(
        public nowTime: NowTimeBase,
        public userService: UserServiceBase,
        private m_Entry: global.UserValue
    ) {
        super(null, nowTime, 99, null);
    }

    public async checkConditions() {
        return false;
    }

    public async getCount() {
        return 0;
    }

    public async update() { }
}

describe('src/contract/user-value-service-base.ts', () => {
    describe('.now', () => {
        it('entry.values', async () => {
            const self = new Self(null, null, {
                id: '',
                values: {
                    99: 11
                }
            });

            const res = await self.now;
            await self.now;
            strictEqual(res, 11);

            const cache = Reflect.get(self, 'm_Now');
            deepStrictEqual(cache, [
                11,
                moment().unix()
            ]);
        });

        it('nowTime', async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(mockNowTime.actual, null, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                11
            );

            const res = await self.now;
            await self.now;
            strictEqual(res, 11);
        });

        it('ok', async () => {
            const self = new Self(null, null, {
                id: '',
                values: {
                    99: 10
                }
            });

            await self.now;

            await new SetTimeoutThread().sleep(1000);

            const res = await self.now;
            strictEqual(res, 11);
        });
    });
});
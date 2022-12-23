import { deepStrictEqual, strictEqual } from 'assert';

import { UserActivityServiceBase } from './user-activity-service-base';
import { UserServiceBase } from './user-service-base';

class Self extends UserActivityServiceBase {
    public initTimeCallCount = 0;

    public constructor(
        public closeOn: number,
        public hideOn: number,
        public openOn: number,
        userService: UserServiceBase,
    ) {
        super(userService);
    }

    protected async initTime() {
        this.initTimeCallCount++;
    }
}

describe('src/contract/user-activity-service-base.ts', () => {
    describe('.getRemainTime(uow: IUnitOfWork)', () => {
        it('ok', async () => {
            const self = new Self(120, 130, 0, {
                now: 100
            } as any);

            const res = await self.getRemainTime(null);
            deepStrictEqual(res, [30, 20]);

            strictEqual(self.initTimeCallCount, 1);
        });
    });
});
import { deepStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { DbFactoryBase } from './db-factory-base';
import { DbRepositoryBase } from './db-repository-base';
import { IDbQuery } from './i-db-query';
import { NowTimeBase } from './now-time-base';
import { UserServiceBase } from './user-service-base';
import { ValueServiceBase } from './value-service-base';
import { global } from '../model';

class Self extends UserServiceBase {
    public constructor(
        public valueService: ValueServiceBase<global.UserValue>,
        dbFactory: DbFactoryBase,
        nowTime: NowTimeBase,
        nowTimeValue: number,
        userID: string,
    ) {
        super(null, userID, dbFactory, null, nowTime, null, null, nowTimeValue, null);
    }

    public async getTargetValueService() {
        return null;
    }
}

describe('src/contract/user-service-base.ts', () => {
    describe('.now', () => {
        it('nowTime', async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self({
                entry: {},
            } as any, null, mockNowTime.actual, 11, null);

            mockNowTime.expectReturn(
                r => r.unix(),
                22
            );

            const res = await self.now;
            strictEqual(res, 22);
        });

        it('value', async () => {
            const self = new Self({
                entry: {
                    id: '',
                    values: {
                        11: 55
                    }
                } as global.UserValue,
            } as any, null, null, 11, null);

            const res = await self.now;
            strictEqual(res, 55);
        });
    });

    describe('.getCustomGiftBagService(uow: IUnitOfWork, scene: string)', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(null, mockDbFactory.actual, null, null, 'uid');

            const mockDbRepo = new Mock<DbRepositoryBase<global.UserCustomGiftBag>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserCustomGiftBag, null),
                mockDbRepo.actual
            );

            const mockDbQuery = new Mock<IDbQuery<global.UserCustomGiftBag>>();
            mockDbRepo.expectReturn(
                r => r.query(),
                mockDbQuery.actual
            );

            mockDbQuery.expectReturn(
                r => r.toArray({
                    where: {
                        id: 'uid'
                    }
                }),
                []
            );

            mockDbRepo.expected.add({
                giftBag: {},
                id: 'uid',
            });

            UserServiceBase.buildCustomGiftBagServiceFunc = (_: any, arg: global.UserCustomGiftBag) => {
                deepStrictEqual(arg, {
                    giftBag: {},
                    id: 'uid',
                });
                return {} as any;
            };

            const res = await self.getCustomGiftBagService(null, 'test');
            deepStrictEqual(res, {
                scene: 'test'
            });
        });
    });
});
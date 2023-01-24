import { deepStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { DbValueService as Self } from './value-service';
import {
    DbFactoryBase,
    DbRepositoryBase,
    EnumFactoryBase,
    IUnitOfWork,
    IUserAssociateService,
    RedisBase,
    UserServiceBase,
} from '../../contract';
import { contract, enum_, global } from '../../model';

describe('src/service/db/value-service-base.ts', () => {
    describe('.getCount(uow: IUnitOfWork, valueType: number)', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const mockRedis = new Mock<RedisBase>();
            const mockAssociateService = new Mock<IUserAssociateService>();
            const mockUserService = new Mock<UserServiceBase>({
                associateService: mockAssociateService.actual,
                userID: 'uid'
            });
            const predicate = (_: global.UserValueChange) => true;
            const self = new Self(
                mockDbFactory.actual,
                mockRedis.actual,
                null,
                null,
                null,
                global.UserValueChange,
                null,
                null,
                predicate,
                mockUserService.actual,
                mockEnumFactory.actual,
                async () => {
                    return {
                        id: '',
                        values: {}
                    };
                }
            );

            mockAssociateService.expectReturn(
                r => r.findAndClear<global.UserValueChange>(global.UserValueChange.name, predicate),
                [{
                    id: 'change-id'
                }]
            );

            const mockDbRepo = new Mock<DbRepositoryBase<global.UserValueChange>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserValueChange, null),
                mockDbRepo.actual
            );

            mockDbRepo.expected.remove({
                id: 'change-id'
            } as global.UserValueChange);

            mockRedis.expectReturn(
                r => r.hsetnx('UserValueChange:uid', 'change-id', ''),
                true
            );

            Reflect.set(self, 'update', (_: IUnitOfWork, res: contract.IValue[]) => {
                deepStrictEqual(res, [{
                    id: 'change-id'
                }]);
            });

            mockRedis.expected.expire('UserValueChange:uid', 10);

            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                {
                    allItem: {}
                }
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });
    });
});
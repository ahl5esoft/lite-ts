import { deepStrictEqual, strictEqual } from 'assert';

import { DbValueService as Self } from './value-service';
import { Mock } from '../assert';
import {
    DbFactoryBase,
    DbRepositoryBase,
    IUnitOfWork,
    IUserAssociateService,
    UserServiceBase,
} from '../../contract';
import { contract, global } from '../../model';

describe('src/service/db/value-service-base.ts', () => {
    describe('.getCount(uow: IUnitOfWork, valueType: number)', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockAssociateService = new Mock<IUserAssociateService>();
            const mockUserService = new Mock<UserServiceBase>({
                associateService: mockAssociateService.actual
            });
            const predicate = (_: global.UserValueChange) => true;
            const self = new Self(
                mockDbFactory.actual,
                null,
                null,
                null,
                global.UserValueChange,
                null,
                null,
                predicate,
                mockUserService.actual,
                null,
                null,
            );

            mockAssociateService.expectReturn(
                r => r.findAndClear<global.UserValueChange>(global.UserValueChange.name, predicate),
                [{}]
            );

            const mockDbRepo = new Mock<DbRepositoryBase<global.UserValueChange>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserValueChange, null),
                mockDbRepo.actual
            );

            mockDbRepo.expected.remove({} as global.UserValueChange);

            Reflect.set(self, 'update', (_: IUnitOfWork, res: contract.IValue[]) => {
                deepStrictEqual(res, [{}]);
            });

            Reflect.set(self, 'getCount', () => {
                return 0;
            });

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });
    });
});
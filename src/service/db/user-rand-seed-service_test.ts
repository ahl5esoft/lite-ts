import { ok, strictEqual } from 'assert';

import { DbUserRandSeedService as Self } from './user-rank-seed-service';
import { Mock, mockAny } from '../assert';
import { DbFactoryBase, DbRepositoryBase, IUnitOfWork, IUserAssociateService } from '../../contract';
import { global } from '../../model';

describe('src/service/db/user-rank-seed-service.ts', () => {
    describe('.get(uow: IUnitOfWork, len: number, offset?: number)', () => {
        it('ok', async () => {
            const self = new Self(null, null, '', '', null);

            Reflect.set(self, 'findSeeds', () => {
                return [...'123456798'];
            });

            const res = await self.get(null, 2, 4);
            strictEqual(res, 56);
        });
    });

    describe('.use(uow: IUnitOfWork, len: number, offset?: number)', () => {
        it('ok', async () => {
            const mockAssociateService = new Mock<IUserAssociateService>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockAssociateService.actual, mockDbFactory.actual, '', '', null);

            Reflect.set(self, 'findSeeds', () => {
                return [...'123456789'];
            });

            mockAssociateService.expectReturn(
                r => r.find(global.UserRandSeed.name, mockAny),
                [{
                    id: '',
                    seed: {}
                }]
            );

            const mockDbRepo = new Mock<DbRepositoryBase<global.UserRandSeed>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserRandSeed, null),
                mockDbRepo.actual
            );

            mockDbRepo.expected.save({
                id: '',
                seed: {
                    ['']: '3456789'
                }
            });

            const res = await self.use(null, 2);
            strictEqual(res, 12);
        });
    });

    describe('.findSeeds(uow: IUnitOfWork)[private]', () => {
        it('ok', async () => {
            const mockAssociateService = new Mock<IUserAssociateService>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockAssociateService.actual, mockDbFactory.actual, '', 'user-id', [1, 8]);

            mockAssociateService.expectReturn(
                r => r.find(global.UserRandSeed.name, mockAny),
                []
            );

            const mockDbRepo = new Mock<DbRepositoryBase<global.UserRandSeed>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserRandSeed, null),
                mockDbRepo.actual
            );

            mockDbRepo.expected.add({
                id: 'user-id',
                seed: {}
            });

            mockAssociateService.expected.add(global.UserRandSeed.name, {
                id: 'user-id',
                seed: {}
            });

            mockDbRepo.expected.save(mockAny);

            const func = Reflect.get(self, 'findSeeds').bind(self) as (uow: IUnitOfWork) => Promise<string[]>;
            const res = await func(null);
            ok(res?.length >= 8);
        });
    });
});
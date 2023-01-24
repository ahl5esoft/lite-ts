import { Mock } from 'lite-ts-mock';

import { UserCustomGiftBagService as Self } from './custom-gift-bag-service';
import { DbFactoryBase, DbRepositoryBase } from '../../contract';
import { global } from '../../model';

describe('src/service/user/custom-gift-bag-service.ts', () => {
    describe('.choose(uow: IUnitOfWork, giftBagNo: number, customIndex: number)', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockDbFactory.actual, {
                giftBag: {}
            } as global.UserCustomGiftBag);

            const mockDbRepo = new Mock<DbRepositoryBase<global.UserCustomGiftBag>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserCustomGiftBag, null),
                mockDbRepo.actual
            );

            self.scene = 'test';

            mockDbRepo.expected.save({
                giftBag: {
                    test: {
                        1: 2
                    }
                }
            } as any);

            await self.choose(null, 1, 2);
        });
    });
});
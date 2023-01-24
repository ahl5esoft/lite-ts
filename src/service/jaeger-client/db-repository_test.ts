import { strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { JaegerClientDbRepository as Self } from './db-repository';
import { DbFactoryBase, DbRepositoryBase } from '../../contract';

class TestDbRepository { }

describe('src/service/jaeger/db-repository.ts', () => {
    describe('.repo[proctected]', () => {
        it('ok', () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockDbFactory.actual, null, null, 'uow' as any, TestDbRepository);

            const mockDbRepo = new Mock<DbRepositoryBase<TestDbRepository>>();
            mockDbFactory.expectReturn(
                r => r.db(TestDbRepository, 'uow'),
                mockDbRepo.actual
            );

            const res = Reflect.get(self, 'repo');
            strictEqual(res, mockDbRepo.actual);
        });
    });
});
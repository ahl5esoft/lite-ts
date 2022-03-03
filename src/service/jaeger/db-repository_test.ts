import { strictEqual } from 'assert';

import { JaegerDbRepository as Self } from './db-repository';
import { Mock } from '../assert';
import { DbFactoryBase, DbRepositoryBase } from '../..';

class TestDbRepository { }

describe('src/service/jaeger/db-repository.ts', () => {
    describe('.repo[proctected]', () => {
        it('ok', () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockDbFactory.actual, null, 'uow' as any, null, TestDbRepository);

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
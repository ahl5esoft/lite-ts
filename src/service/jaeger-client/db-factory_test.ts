import { strictEqual } from 'assert';
import { opentracing } from 'jaeger-client';

import { JaegerClientDbFactory as Self } from './db-factory';
import { JaegerClientDbRepository } from './db-repository';
import { JaegerClientUnitOfWork } from './unit-of-work';
import { Mock } from '../assert';
import { DbFactoryBase, IUnitOfWork } from '../../contract';

describe('src/service/jaeger/db-factory.ts', () => {
    describe('.db<T>(model: new () => T, uow?: UnitOfWorkRepositoryBase)', () => {
        class DbModel { }

        it('ok', () => {
            const self = new Self(
                null,
                new opentracing.Span()
            );

            const res = self.db(DbModel);
            strictEqual(res.constructor, JaegerClientDbRepository);
        });
    });
    describe('.uow()', () => {
        it('ok', () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(
                mockDbFactory.actual,
                new opentracing.Span()
            );

            const mockUow = new Mock<IUnitOfWork>();
            mockDbFactory.expectReturn(
                r => r.uow(),
                mockUow.actual
            );

            const res = self.uow();
            strictEqual(res.constructor, JaegerClientUnitOfWork);
        });
    });
});
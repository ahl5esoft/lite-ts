import { strictEqual } from 'assert';
import { opentracing } from 'jaeger-client';

import { JaegerDbFactory as Self } from './db-factory';
import { JaegerDbRepository } from './db-repository';
import { JaegerUnitOfWork } from './unit-of-work';
import { Mock } from '../assert';
import { DbFactoryBase, DbRepositoryBase, IUnitOfWork } from '../../contract';

describe('src/service/jaeger/db-factory.ts', () => {
    describe('.db<T>(model: new () => T, uow?: UnitOfWorkRepositoryBase)', () => {
        class DbModel { }

        it('tracer', () => {
            const self = new Self(
                null,
                new opentracing.Span()
            );

            const res = self.db(DbModel);
            strictEqual(res.constructor, JaegerDbRepository);
        });

        it('default', () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockDbFactory.actual, null);

            const mockDbRepo = new Mock<DbRepositoryBase<DbModel>>();
            mockDbFactory.expectReturn(
                r => r.db(DbModel, undefined),
                mockDbRepo.actual
            );

            const res = self.db(DbModel);
            strictEqual(res, mockDbRepo.actual);
        });
    });
    describe('.uow()', () => {
        it('tracer', () => {
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
            strictEqual(res.constructor, JaegerUnitOfWork);
        });

        it('default', () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockDbFactory.actual);

            const mockUow = new Mock<IUnitOfWork>();
            mockDbFactory.expectReturn(
                r => r.uow(),
                mockUow.actual
            );

            const res = self.uow();
            strictEqual(res, mockUow.actual);
        });
    });
});
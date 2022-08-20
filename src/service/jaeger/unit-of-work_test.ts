import { opentracing } from 'jaeger-client';

import { JaegerUnitOfWork as Self } from './unit-of-work';
import { Mock } from '../assert';
import { UnitOfWorkRepositoryBase } from '../..';

class TestUnitOfWorkModel { }

describe('src/service/jaeger/unit-of-work.ts', () => {
    describe('.commit()', () => {
        it('ok', async () => {
            const mockUow = new Mock<UnitOfWorkRepositoryBase>();
            const self = new Self(mockUow.actual, null);

            const mockSpan = new Mock<opentracing.Span>();
            Reflect.set(self, 'm_Span', mockSpan.actual);

            mockSpan.expected.setTag(opentracing.Tags.DB_STATEMENT, 'commit');

            mockUow.expected.commit();

            mockSpan.expected.log({});

            mockSpan.expected.finish();

            await self.commit();
        });
    });

    describe('.registerAdd<T>(model: new () => T, entry: T)', () => {
        it('ok', () => {
            const self = new Self(null, null);

            self.registerAdd(TestUnitOfWorkModel, {});

            // const res = Reflect
        });
    });

    describe('.registerRemove(table: string, entry: any)', () => {
        it('ok', () => {
            const mockUow = new Mock<UnitOfWorkRepositoryBase>();
            const self = new Self(mockUow.actual, null);

            mockUow.expected.registerRemove(TestUnitOfWorkModel, {});

            self.registerRemove(TestUnitOfWorkModel, {});
        });
    });

    describe('.registerSave(table: string, entry: any)', () => {
        it('ok', () => {
            const mockUow = new Mock<UnitOfWorkRepositoryBase>();
            const self = new Self(mockUow.actual, null);

            mockUow.expected.registerSave(TestUnitOfWorkModel, {});

            self.registerSave(TestUnitOfWorkModel, {});
        });
    });
});
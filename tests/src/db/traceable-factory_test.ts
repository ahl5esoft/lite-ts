import { DBFactoryBase, Mock, TraceableDBFactory, TraceFactoryBase } from '../../../src';

class Model { }

describe('src/db/traceable-factory.ts', () => {
    describe('.db<T>(model: Function, uow?: UnitOfWorkBase): DBRepositoryBase<T>', () => {
        it('ok', () => {
            const mockDBFactory = new Mock<DBFactoryBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableDBFactory(mockDBFactory.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'trace-span-id';

            mockDBFactory.expectReturn(
                r => r.db(Model, undefined),
                null
            );

            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                null
            );

            self.db<Model>(Model);
        });
    });

    describe('.uow(): UnitOfWorkBase', () => {
        it('ok', () => {
            const mockDBFactory = new Mock<DBFactoryBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableDBFactory(mockDBFactory.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'trace-span-id';

            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                null
            );

            mockDBFactory.expected.uow();

            self.uow();
        });
    });
});
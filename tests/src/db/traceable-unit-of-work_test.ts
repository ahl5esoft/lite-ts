import { deepStrictEqual } from 'assert';

import { Mock, TraceBase, TraceSpanBase, UnitOfWorkBase } from '../../../src';
import { TraceableUnitOfWork } from '../../../src/db/traceable-unit-of-work';

describe('src/db/traceable-unit-of-work.ts', () => {
    describe('.commit()', () => {
        it('ok', async () => {
            const mockTrace = new Mock<TraceBase>();
            const traceSpanID = 'span-id';
            const mockUow = new Mock<UnitOfWorkBase>();
            const self = new TraceableUnitOfWork(mockTrace.actual, traceSpanID, mockUow.actual);

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('uow');

            mockTraceSpan.expected.addLabel('actions', []);

            mockUow.expectReturn(
                r => r.commit(),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.commit();

            const res = Reflect.get(self, 'm_Actions');
            deepStrictEqual(res, []);
        });
    });

    describe('.registerAdd(table: string, entry: any)', () => {
        it('ok', () => {
            const mockTrace = new Mock<TraceBase>();
            const traceSpanID = 'span-id';
            const mockUow = new Mock<UnitOfWorkBase>();
            const self = new TraceableUnitOfWork(mockTrace.actual, traceSpanID, mockUow.actual);

            const table = 'table';
            const entry = {};
            mockUow.expected.registerAdd(table, entry);

            self.registerAdd(table, entry);

            const res = Reflect.get(self, 'm_Actions');
            deepStrictEqual(res, [{
                action: 'add',
                entry: entry,
                table: table
            }]);
        });
    });

    describe('.registerRemove(table: string, entry: any)', () => {
        it('ok', () => {
            const mockTrace = new Mock<TraceBase>();
            const traceSpanID = 'span-id';
            const mockUow = new Mock<UnitOfWorkBase>();
            const self = new TraceableUnitOfWork(mockTrace.actual, traceSpanID, mockUow.actual);

            const table = 'table';
            const entry = {};
            mockUow.expected.registerRemove(table, entry);

            self.registerRemove(table, entry);

            const res = Reflect.get(self, 'm_Actions');
            deepStrictEqual(res, [{
                action: 'remove',
                entry: entry,
                table: table
            }]);
        });
    });

    describe('.registerSave(table: string, entry: any)', () => {
        it('ok', () => {
            const mockTrace = new Mock<TraceBase>();
            const traceSpanID = 'span-id';
            const mockUow = new Mock<UnitOfWorkBase>();
            const self = new TraceableUnitOfWork(mockTrace.actual, traceSpanID, mockUow.actual);

            const table = 'table';
            const entry = {};
            mockUow.expected.registerSave(table, entry);

            self.registerSave(table, entry);

            const res = Reflect.get(self, 'm_Actions');
            deepStrictEqual(res, [{
                action: 'save',
                entry: entry,
                table: table
            }]);
        });
    });
});
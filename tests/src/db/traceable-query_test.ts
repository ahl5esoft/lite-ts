import { deepStrictEqual } from 'assert';

import { DBQueryBase, Mock, TraceBase, TraceSpanBase } from '../../../src';
import { TraceableDBQuery } from '../../../src/db/traceable-query';

class Model { }

describe('src/db/traceable-query.ts', () => {
    describe('.count(): Promise<number>', () => {
        it('ok', async () => {
            const mockQuery = new Mock<DBQueryBase<Model>>();
            const table = 'table';
            const mockTrace = new Mock<TraceBase>();
            const traceSpanID = 'span-id';
            const self = new TraceableDBQuery(mockQuery.actual, table, mockTrace.actual, traceSpanID);

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('db');

            mockTraceSpan.expected.addLabel('query', 'count');

            mockTraceSpan.expected.addLabel('table', table);

            mockQuery.expectReturn(
                r => r.count(),
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

            await self.count();

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, {});
        });
    });

    describe('.order(...fields: string[]): this', () => {
        it('ok', () => {
            const mockQuery = new Mock<DBQueryBase<Model>>();
            const table = 'table';
            const mockTrace = new Mock<TraceBase>();
            const traceSpanID = 'span-id';
            const self = new TraceableDBQuery(mockQuery.actual, table, mockTrace.actual, traceSpanID);

            const fields = ['a', 'b'];
            mockQuery.expected.order(...fields);

            self.order(...fields);

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, {
                order: fields
            });
        });
    });

    describe('.orderByDesc(...fields: string[]): this', () => {
        it('ok', () => {
            const mockQuery = new Mock<DBQueryBase<Model>>();
            const table = 'table';
            const mockTrace = new Mock<TraceBase>();
            const traceSpanID = 'span-id';
            const self = new TraceableDBQuery(mockQuery.actual, table, mockTrace.actual, traceSpanID);

            const fields = ['a', 'b'];
            mockQuery.expected.orderByDesc(...fields);

            self.orderByDesc(...fields);

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, {
                orderByDesc: fields
            });
        });
    });

    describe('.skip(value: number): this', () => {
        it('ok', () => {
            const mockQuery = new Mock<DBQueryBase<Model>>();
            const table = 'table';
            const mockTrace = new Mock<TraceBase>();
            const traceSpanID = 'span-id';
            const self = new TraceableDBQuery(mockQuery.actual, table, mockTrace.actual, traceSpanID);

            const skip = 10;
            mockQuery.expected.skip(skip);

            self.skip(skip);

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, {
                skip: skip
            });
        });
    });

    describe('.take(value: number): this', () => {
        it('ok', () => {
            const mockQuery = new Mock<DBQueryBase<Model>>();
            const table = 'table';
            const mockTrace = new Mock<TraceBase>();
            const traceSpanID = 'span-id';
            const self = new TraceableDBQuery(mockQuery.actual, table, mockTrace.actual, traceSpanID);

            const take = 10;
            mockQuery.expected.take(take);

            self.take(take);

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, {
                take: take
            });
        });
    });

    describe('.toArray(): Promise<T[]>', () => {
        it('ok', async () => {
            const mockQuery = new Mock<DBQueryBase<Model>>();
            const table = 'table';
            const mockTrace = new Mock<TraceBase>();
            const traceSpanID = 'span-id';
            const self = new TraceableDBQuery(mockQuery.actual, table, mockTrace.actual, traceSpanID);

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('db');

            mockTraceSpan.expected.addLabel('query', 'toArray');

            mockTraceSpan.expected.addLabel('table', table);

            mockQuery.expectReturn(
                r => r.toArray(),
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

            await self.toArray();

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, {});
        });
    });

    describe('.where(filter: any): this', () => {
        it('ok', () => {
            const mockQuery = new Mock<DBQueryBase<Model>>();
            const table = 'table';
            const mockTrace = new Mock<TraceBase>();
            const traceSpanID = 'span-id';
            const self = new TraceableDBQuery(mockQuery.actual, table, mockTrace.actual, traceSpanID);

            const filter = { a: 'b' };
            mockQuery.expected.where(filter);

            self.where(filter);

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, {
                where: filter
            });
        });
    });
});
import { deepStrictEqual, strictEqual } from 'assert';
import { opentracing } from 'jaeger-client';

import { JaegerDbQuery as Self } from './db-query';
import { Mock } from '../assert';
import { IDbQuery } from '../../contract';

class TestDbQuery { }

describe('src/service/opentracing/db-query.ts', () => {
    describe('.count()', async () => {
        it('ok', async () => {
            const mockDbQuery = new Mock<IDbQuery<TestDbQuery>>();
            const self = new Self(mockDbQuery.actual, TestDbQuery.name, null);

            const mockSpan = new Mock<opentracing.Span>();
            Reflect.set(self, 'm_Span', mockSpan.actual);

            mockDbQuery.expectReturn(
                r => r.count(),
                1
            );

            mockSpan.expectReturn(
                r => r.setTag(opentracing.Tags.DB_STATEMENT, 'count'),
                mockSpan.actual
            );

            mockSpan.expectReturn(
                r => r.log({
                    result: 1
                }),
                mockSpan.actual
            );

            mockSpan.expected.finish();

            const res = await self.count();
            strictEqual(res, 1);
        });
    });

    describe('.order(...fields: string[])', () => {
        it('ok', () => {
            const mockDbQuery = new Mock<IDbQuery<TestDbQuery>>();
            const self = new Self(mockDbQuery.actual, TestDbQuery.name, null);

            const mockSpan = new Mock<opentracing.Span>();
            Reflect.set(self, 'm_Span', mockSpan.actual);

            mockSpan.expected.log({
                order: ['a', 'b']
            });

            mockDbQuery.expectReturn(
                r => r.order('a', 'b'),
                mockDbQuery.actual
            );

            const res = self.order('a', 'b');
            strictEqual(res, self);
        });
    });

    describe('.orderByDesc(...fields: string[])', () => {
        it('ok', () => {
            const mockDbQuery = new Mock<IDbQuery<TestDbQuery>>();
            const self = new Self(mockDbQuery.actual, TestDbQuery.name, null);

            const mockSpan = new Mock<opentracing.Span>();
            Reflect.set(self, 'm_Span', mockSpan.actual);

            mockSpan.expected.log({
                orderByDesc: ['a', 'b']
            });

            mockDbQuery.expectReturn(
                r => r.orderByDesc('a', 'b'),
                mockDbQuery.actual
            );

            const res = self.orderByDesc('a', 'b');
            strictEqual(res, self);
        });
    });

    describe('.skip(value: number)', () => {
        it('ok', () => {
            const mockDbQuery = new Mock<IDbQuery<TestDbQuery>>();
            const self = new Self(mockDbQuery.actual, TestDbQuery.name, null);

            const mockSpan = new Mock<opentracing.Span>();
            Reflect.set(self, 'm_Span', mockSpan.actual);

            mockSpan.expected.log({
                skip: 5
            });

            mockDbQuery.expectReturn(
                r => r.skip(5),
                mockDbQuery.actual
            );

            const res = self.skip(5);
            strictEqual(res, self);
        });
    });

    describe('.take(value: number)', () => {
        it('ok', () => {
            const mockDbQuery = new Mock<IDbQuery<TestDbQuery>>();
            const self = new Self(mockDbQuery.actual, TestDbQuery.name, null);

            const mockSpan = new Mock<opentracing.Span>();
            Reflect.set(self, 'm_Span', mockSpan.actual);

            mockSpan.expected.log({
                take: 55
            });

            mockDbQuery.expectReturn(
                r => r.take(55),
                mockDbQuery.actual
            );

            const res = self.take(55);
            strictEqual(res, self);
        });
    });

    describe('.toArray()', async () => {
        it('ok', async () => {
            const mockDbQuery = new Mock<IDbQuery<TestDbQuery>>();
            const self = new Self(mockDbQuery.actual, TestDbQuery.name, null);

            mockDbQuery.expectReturn(
                r => r.toArray(),
                [{}]
            );

            const mockSpan = new Mock<opentracing.Span>();
            Reflect.set(self, 'm_Span', mockSpan.actual);

            mockSpan.expectReturn(
                r => r.setTag(opentracing.Tags.DB_STATEMENT, 'toArray'),
                mockSpan.actual
            );

            mockSpan.expectReturn(
                r => r.log({
                    result: [{}]
                }),
                mockSpan.actual
            );

            mockSpan.expected.finish();

            const res = await self.toArray();
            deepStrictEqual(res, [{}]);
        });
    });

    describe('.where(selecor: any)', () => {
        it('ok', () => {
            const mockDbQuery = new Mock<IDbQuery<TestDbQuery>>();
            const self = new Self(mockDbQuery.actual, TestDbQuery.name, null);

            const mockSpan = new Mock<opentracing.Span>();
            Reflect.set(self, 'm_Span', mockSpan.actual);

            mockSpan.expected.log({
                where: {
                    id: 'id-1'
                }
            });

            mockDbQuery.expectReturn(
                r => r.where({
                    id: 'id-1'
                }),
                mockDbQuery.actual
            );

            const res = self.where({
                id: 'id-1'
            });
            strictEqual(res, self);
        });
    });
});
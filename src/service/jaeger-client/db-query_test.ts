import { deepStrictEqual, strictEqual } from 'assert';
import { opentracing } from 'jaeger-client';

import { JaegerClientDbQuery as Self } from './db-query';
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

    describe('.toArray(v?: Partial<IDbQueryOption>)', async () => {
        it('ok', async () => {
            const mockDbQuery = new Mock<IDbQuery<TestDbQuery>>();
            const self = new Self(mockDbQuery.actual, TestDbQuery.name, null);

            mockDbQuery.expectReturn(
                r => r.toArray(undefined),
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
});
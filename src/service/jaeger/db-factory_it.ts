import { strictEqual } from 'assert';
import { initTracer, opentracing } from 'jaeger-client';

import { JaegerDbFactory as Self } from './db-factory';
import { MongoDbFactory } from '../mongo';
import { DbFactoryBase } from '../../contract';

class TestJaeger {
    public age: number;
    public id: string;
    public name: string;
}

const dbFactory: DbFactoryBase = new MongoDbFactory(false, 'lite-ts', 'mongodb://localhost:27017');
const tracer = initTracer({
    reporter: {
        collectorEndpoint: 'http://10.10.0.66:14268/api/traces'
    },
    sampler: {
        type: 'const',
        param: 1,
    },
    serviceName: 'lite-ts'
}, {
    tags: {
        version: '9.65.26'
    }
});
opentracing.initGlobalTracer(tracer);

describe('src/service/jaeger/db-factory.ts', () => {
    after(async () => {
        await new Promise<void>(s => {
            tracer.close(s);
        });
    });

    afterEach(async () => {
        const db = dbFactory.db(TestJaeger);
        const rows = await db.query().toArray();
        for (const r of rows)
            await db.remove(r);
    });

    describe('.db<T>(model: new () => T, uow?: UnitOfWorkRepositoryBase)', () => {
        it('count', async () => {
            const self: DbFactoryBase = new Self(dbFactory);

            await dbFactory.db(TestJaeger).add({
                age: 1,
                id: 'it-count',
                name: 'count'
            });

            const res = await self.db(TestJaeger).query().count();
            strictEqual(res, 1);
        });

        it('toArray', async () => {
            const self: DbFactoryBase = new Self(dbFactory);

            for (let i = 1; i <= 10; i++) {
                await dbFactory.db(TestJaeger).add({
                    age: i,
                    id: `it-toArray-${i}`,
                    name: 'toArray'
                });
            }

            const ages = [1, 3, 5, 7, 9];
            const res = await self.db(TestJaeger).query().where({
                age: {
                    $in: ages
                }
            }).toArray();
            strictEqual(res.length, ages.length);
        });
    });

    describe('.uow()', () => {
        it('ok', async () => {
            const self: DbFactoryBase = new Self(dbFactory);

            const uow = self.uow();
            const db = self.db(TestJaeger, uow);
            for (let i = 1; i <= 10; i++) {
                await db.add({
                    age: i,
                    id: `it-toArray-${i}`,
                    name: 'toArray'
                });
            }
            await uow.commit();

            const res = await dbFactory.db(TestJaeger).query().count();
            strictEqual(res, 10);
        });
    });
});
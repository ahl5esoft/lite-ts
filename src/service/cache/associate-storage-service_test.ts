import { deepStrictEqual } from 'assert';

import { CacheAssociateStorageService as Self } from './associate-storage-service';

class Model {
    public no?: number;
}

describe('src/service/db/associate-storage-service.ts', () => {
    describe('.add<T>(model: new () => T, entry: T)', () => {
        it('ok', async () => {
            const self = new Self(null);

            self.add(Model, {});

            const cache = Reflect.get(self, 'm_Associates');
            deepStrictEqual(cache, {
                [Model.name]: [{}]
            });
        });
    });

    describe('.clear<T>(model: new () => T, filterFunc: (r: T) => boolean)', () => {
        it('ok', async () => {
            const self = new Self(null);

            Reflect.set(self, 'm_Associates', {
                [Model.name]: [{
                    no: 1
                }, {
                    no: 2
                }]
            });

            self.clear(Model, r => {
                return r.no % 2 == 0;
            });

            const cache = Reflect.get(self, 'm_Associates');
            deepStrictEqual(cache, {
                [Model.name]: [{
                    no: 1
                }]
            });
        });
    });

    describe('.find<T>(model: new () => T, filterFunc: (r: T) => boolean)', () => {
        it('ok', async () => {
            const self = new Self({
                [Model.name]: async () => {
                    return [];
                }
            });

            const res = await self.find(Model, () => {
                return true;
            });
            deepStrictEqual(res, []);

            const cache = Reflect.get(self, 'm_Associates');
            deepStrictEqual(cache, {
                [Model.name]: []
            });
        });
    });
});
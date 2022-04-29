import { deepStrictEqual } from 'assert';

import { CacheUserAssociateService as Self } from './user-associate-service';

class Model {
    public no?: number;
}

describe('src/service/user/associate-service.ts', () => {
    describe('.add<T>(model: new () => T, entry: T)', () => {
        it('ok', () => {
            const self = new Self(null);

            self.add(Model.name, {});

            const cache = Reflect.get(self, 'm_Associates');
            deepStrictEqual(cache, {
                [Model.name]: [{}]
            });
        });
    });

    describe('.find<T>(key: string, predicate: (r: T) => boolean)', () => {
        it('ok', async () => {
            const self = new Self({
                [Model.name]: async () => {
                    return [];
                }
            });

            const res = await self.find(Model.name, () => {
                return true;
            });
            deepStrictEqual(res, []);

            const cache = Reflect.get(self, 'm_Associates');
            deepStrictEqual(cache, {
                [Model.name]: []
            });
        });
    });

    describe('.findAndClear<T>(key: string, predicate: (r: T) => boolean)', () => {
        it('ok', async () => {
            const self = new Self({
                [Model.name]: async () => {
                    return [{
                        no: 1
                    }, {
                        no: 2
                    }];
                }
            });

            const res = await self.findAndClear<Model>(Model.name, r => {
                return r.no % 2 == 0;
            });
            deepStrictEqual(res, [{
                no: 2
            }]);

            const cache = Reflect.get(self, 'm_Associates');
            deepStrictEqual(cache, {
                [Model.name]: [{
                    no: 1
                }]
            });
        });
    });
});
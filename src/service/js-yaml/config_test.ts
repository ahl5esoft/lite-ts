import { deepStrictEqual, strictEqual } from 'assert';

import { Config as Self } from './config';
import { YamlConfigFactory } from './config-factory';

describe('src/service/js-yaml/config.ts', () => {
    describe('.get<T>(key?: string): Promise<T>', () => {
        it('group', async () => {
            let factory = new YamlConfigFactory(null);
            Reflect.set(factory, 'm_Doc', {
                group: {}
            });

            const res = await new Self(factory, 'group').get();
            deepStrictEqual(res, {});
        });

        it('key', async () => {
            let factory = new YamlConfigFactory(null);
            Reflect.set(factory, 'm_Doc', {
                group: {
                    k: 'v'
                }
            });

            const res = await new Self(factory, 'group').get('k');
            deepStrictEqual(res, 'v');
        });
    });

    describe('.has(key?: string): Promise<boolean>', () => {
        it('group', async () => {
            let factory = new YamlConfigFactory(null);
            Reflect.set(factory, 'm_Doc', {
                group: {}
            });

            const res = await new Self(factory, 'group').has();
            strictEqual(res, true);
        });

        it('group不存在', async () => {
            let factory = new YamlConfigFactory(null);
            Reflect.set(factory, 'm_Doc', {});

            const res = await new Self(factory, 'group').has();
            strictEqual(res, false);
        });

        it('key', async () => {
            let factory = new YamlConfigFactory(null);
            Reflect.set(factory, 'm_Doc', {
                group: {
                    k: 0
                }
            });

            const res = await new Self(factory, 'group').has('k');
            strictEqual(res, true);
        });
    });
});
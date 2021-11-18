import { deepStrictEqual } from 'assert';

import { Config as Self } from './config';
import { YamlConfigFactory } from './config-factory';

describe('src/service/js-yaml/config.ts', () => {
    describe('.get<T>(key?: string): Promise<T>', () => {
        it('ok', async () => {
            let factory = new YamlConfigFactory(null);
            Reflect.set(factory, 'm_Doc', {
                group: {}
            });

            const res = await new Self('group', factory).get();
            deepStrictEqual(res, {});
        });
    });
});
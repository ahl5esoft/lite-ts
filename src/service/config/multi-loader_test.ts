import { deepStrictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { MultiConfigLoader as Self } from './multi-loader';
import { ConfigLoaderBase } from '../../contract';

class ConfigTest { }

describe('src/service/config/multi-loader.ts', () => {
    describe('.load<T>(ctor: new () => T)', () => {
        it('ok', async () => {
            const mockConfigLoader1 = new Mock<ConfigLoaderBase>();
            const mockConfigLoader2 = new Mock<ConfigLoaderBase>();
            const self = new Self([mockConfigLoader1.actual, mockConfigLoader2.actual]);

            mockConfigLoader1.expectReturn(
                r => r.load(ConfigTest),
                null
            );

            mockConfigLoader2.expectReturn(
                r => r.load(ConfigTest),
                {}
            );

            const res = await self.load(ConfigTest);
            deepStrictEqual(res, {});
        });
    });
});
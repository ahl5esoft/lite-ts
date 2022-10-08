import { strictEqual } from 'assert';

import { ConfigLoadBalance as Self } from './load-balance';
import { Mock } from '../assert';
import { ConfigLoaderBase } from '../../contract';
import { config } from '../../model';

describe('src/model/config/load-balance.ts', () => {
    describe('.getUrl(app: string, env: string)', () => {
        it('ok', async () => {
            const mockConfigLoader = new Mock<ConfigLoaderBase>();
            const self = new Self(mockConfigLoader.actual, 'test');

            mockConfigLoader.expectReturn(
                r => r.load(config.LoadBalance),
                {
                    test: {
                        app: {
                            '': 'url'
                        }
                    }
                }
            );

            const res = await self.getUrl('app', undefined);
            strictEqual(res, 'url');
        });

        it('mod(false)', async () => {
            const mockConfigLoader = new Mock<ConfigLoaderBase>();
            const self = new Self(mockConfigLoader.actual, 'test');

            mockConfigLoader.expectReturn(
                r => r.load(config.LoadBalance),
                {
                    test: {
                        app: {
                            '': {
                                default: 'd-url',
                                mod: ['m-url', 5],
                            }
                        }
                    }
                }
            );

            Reflect.set(self, 'm_GetTimeFunc', () => {
                return 1;
            });

            const res = await self.getUrl('app', undefined);
            strictEqual(res, 'd-url');
        });

        it('mod(true)', async () => {
            const mockConfigLoader = new Mock<ConfigLoaderBase>();
            const self = new Self(mockConfigLoader.actual, 'test');

            mockConfigLoader.expectReturn(
                r => r.load(config.LoadBalance),
                {
                    test: {
                        app: {
                            '': {
                                default: 'd-url',
                                mod: ['m-url', 5],
                            }
                        }
                    }
                }
            );

            Reflect.set(self, 'm_GetTimeFunc', () => {
                return 10;
            });

            const res = await self.getUrl('app', undefined);
            strictEqual(res, 'm-url');
        });
    });
});
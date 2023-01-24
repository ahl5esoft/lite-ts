import { strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { ConfigLoadBalance as Self } from './load-balance';
import { ConfigLoaderBase } from '../../contract';
import { config } from '../../model';

describe('src/model/config/load-balance.ts', () => {
    describe('.getUrl(app: string, env: string)', () => {
        it('ok', async () => {
            const mockConfigLoader = new Mock<ConfigLoaderBase>();
            const self = new Self(mockConfigLoader.actual, 'http');

            mockConfigLoader.expectReturn(
                r => r.load(config.LoadBalance),
                {
                    http: {
                        app: {
                            '': 'url'
                        }
                    }
                }
            );

            const res = await self.getUrl('app', undefined);
            strictEqual(res, 'url');
        });

        it('percent(false)', async () => {
            const mockConfigLoader = new Mock<ConfigLoaderBase>();
            const self = new Self(mockConfigLoader.actual, 'http');

            mockConfigLoader.expectReturn(
                r => r.load(config.LoadBalance),
                {
                    http: {
                        app: {
                            '': {
                                default: 'd-url',
                                percent: ['m-url', 5],
                            }
                        }
                    }
                }
            );

            Reflect.set(self, 'm_GetTimeFunc', () => {
                return 6;
            });

            const res = await self.getUrl('app', undefined);
            strictEqual(res, 'd-url');
        });

        it('mod(true)', async () => {
            const mockConfigLoader = new Mock<ConfigLoaderBase>();
            const self = new Self(mockConfigLoader.actual, 'http');

            mockConfigLoader.expectReturn(
                r => r.load(config.LoadBalance),
                {
                    http: {
                        app: {
                            '': {
                                default: 'd-url',
                                percent: ['m-url', 5],
                            }
                        }
                    }
                }
            );

            Reflect.set(self, 'm_GetTimeFunc', () => {
                return 1;
            });

            const res = await self.getUrl('app', undefined);
            strictEqual(res, 'm-url');
        });
    });
});
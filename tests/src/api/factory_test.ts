import { deepStrictEqual, strictEqual } from 'assert';

import { APIFactory, invalidAPI } from '../../../src/api';

describe('src/api/factory.ts', (): void => {
    describe('.build(endpoint: string, apiName: string): Promise<IAPI>', (): void => {
        it('api目录不存在', async (): Promise<void> => {
            const mockAPIDir: any = {
                exists: (): boolean => {
                    return false;
                }
            };
            const buildDirectoryArgs = [];
            const mockIOFactory: any = {
                buildDirectory: (...args: string[]): any => {
                    buildDirectoryArgs.push(args);
                    return mockAPIDir;
                }
            };
            const res = await new APIFactory('root', mockIOFactory).build('', '');
            strictEqual(res, invalidAPI);
            deepStrictEqual(buildDirectoryArgs, [
                ['root', 'api']
            ]);
        });

        it('endpoint目录不存在', async (): Promise<void> => {
            const mockAPIDir: any = {
                path: 'api-dir',
                exists: (): boolean => {
                    return true;
                }
            };
            const mockEndpointDir: any = {
                exists: (): boolean => {
                    return false;
                }
            };
            const buildDirectoryQueue = [mockAPIDir, mockEndpointDir];
            const buildDirectoryArgs = [];
            const mockIOFactory: any = {
                buildDirectory: (...args: string[]): any => {
                    buildDirectoryArgs.push(args);
                    return buildDirectoryQueue.shift();
                }
            };
            const res = await new APIFactory('root', mockIOFactory).build('e', '');
            strictEqual(res, invalidAPI);
            deepStrictEqual(buildDirectoryArgs, [
                ['root', 'api'],
                ['api-dir', 'e']
            ]);
        });
    });
});
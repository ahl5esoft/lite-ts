import { notStrictEqual } from 'assert';

import { createApiFactory } from './factory';
import { Mock } from '../assert';
import { IDirectory } from '../../contract';

describe('src/service/api/factory.ts', () => {
    describe('.build(endpoint: string, apiName: string)', () => {
        it('不存在', async () => {
            const mockDir = new Mock<IDirectory>();

            mockDir.expectReturn(
                r => r.findDirectories(),
                []
            );

            const self = await createApiFactory(mockDir.actual);
            const res = self.build('endpoint', 'api');
            let err: Error;
            try {
                await res.call();
            } catch (e) {
                err = e;
            }
            notStrictEqual(err, undefined);
        });
    });
});
import { notStrictEqual } from 'assert';

import { APIFactory as Self } from './factory';
import { IODirectoryBase, service } from '../..';

describe('src/service/api/factory.ts', () => {
    describe('.build(endpoint: string, apiName: string): IAPI', () => {
        it('不存在', async () => {
            const mockDir = new service.Mock<IODirectoryBase>();

            mockDir.expectReturn(
                r => r.findDirectories(),
                []
            );

            const self = await Self.create(mockDir.actual);
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
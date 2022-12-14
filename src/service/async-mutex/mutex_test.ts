import { notStrictEqual } from 'assert';

import { AsyncMutexMutex as Self } from './mutex';

describe('src/service/async-mutex/mutex.ts', () => {
    describe('.lock()', () => {
        it('ok', async () => {
            const self = new Self();

            let count = 0;
            for (let i = 0; i < 100; i++) {
                (() => {
                    count++;
                })();
            }

            let parallelCount = 0;
            for (let i = 0; i < 100; i++) {
                (async () => {
                    const unlock = await self.lock();
                    parallelCount++;
                    unlock();
                })();
            }

            console.log(parallelCount, count);
            notStrictEqual(parallelCount, count);
        });
    });
});
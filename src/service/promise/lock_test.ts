import { strictEqual } from 'assert';

import { PromiseLock as Self } from './lock';
import { sleep } from '../set-timeout';

describe('src/service/promise/lock.ts', () => {
    describe('.lock(): Promise<() => Promise<void>>', () => {
        it('ok', async () => {
            const self = new Self();
            let count = 0;
            for (let i = 0; i < 10; i++) {
                (async () => {
                    const unlock = await self.lock();
                    count++;
                    await unlock();
                })();
            }

            await sleep(1000);
            strictEqual(count, 10);
        });
    });
});
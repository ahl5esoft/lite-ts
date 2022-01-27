import { ok } from 'assert';

import { SetTimeoutThread as Self } from './thread';

describe('src/service/set-timeout/thread.ts', () => {
    describe('.sleep(ms: number)', () => {
        it('ok', async () => {
            const beginOn = Date.now();
            await new Self().sleep(500);
            const res = Date.now() - beginOn;
            ok(res >= 500 && res <= 550);
        });
    });

    describe('.sleepRange(minMs: number, maxMs: number)', () => {
        it('ok', async () => {
            for (let i = 0; i < 10; i++) {
                const beginOn = Date.now();
                await new Self().sleepRange(500, 1000);
                const res = Date.now() - beginOn;
                ok(res >= 500 && res <= 1000);
            }
        });
    });
});
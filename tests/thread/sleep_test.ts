import { ok } from 'assert';

import { sleep } from '../../thread';

describe('thread/sleep.ts', (): void => {
    describe('.sleep(ms: number): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            const beginedOn = Date.now();
            const duration = 3000;
            await sleep(duration);
            const endedOn = Date.now();
            ok(endedOn - beginedOn >= duration);
        });
    });
});

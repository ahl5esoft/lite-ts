import { ok, strictEqual } from 'assert';

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
            let self = new Self();

            Reflect.set(self, 'sleep', (arg: number) => {
                ok(
                    arg >= 500 && arg < 1000
                );
            });

            for (let i = 0; i < 99; i++)
                await self.sleepRange(500, 1000);
        });
    });

    describe('.try(action: () => Promise<void>, count: number, interval = 5 * 1000)', () => {
        it('第一次成功', async () => {
            const self = new Self();

            let assertCount = 0;
            Reflect.set(self, 'sleep', (arg: number) => {
                strictEqual(arg, 300);
                assertCount++;
            });

            let err: Error;
            try {
                await self.try(async () => { }, 5, 300);
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
            strictEqual(assertCount, 0);
        });

        it('最后一次成功', async () => {
            const self = new Self();

            let assertCount = 0;
            Reflect.set(self, 'sleep', (arg: number) => {
                strictEqual(arg, 500);
                assertCount++;
            });

            let err: Error;
            try {
                let count = 0;
                await self.try(async () => {
                    if (++count == 5)
                        return;

                    throw new Error('test');
                }, 5, 500);
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
            strictEqual(assertCount, 4);
        });

        it('全部失败', async () => {
            const self = new Self();

            let assertCount = 0;
            Reflect.set(self, 'sleep', (arg: number) => {
                strictEqual(arg, 500);
                assertCount++;
            });

            const actionError = new Error('test');
            let err: Error;
            try {
                await self.try(async () => {
                    throw actionError;
                }, 5, 500);
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, actionError);
            strictEqual(assertCount, 4);
        });
    });
});
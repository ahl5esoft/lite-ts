import { deepStrictEqual, strictEqual } from 'assert';

import { Log4jsLog as Self } from './log';

describe('src/service/log4js/log.ts', () => {
    describe('.addLabel(k: string, v: any)', () => {
        it('ok', async () => {
            const self = new Self();

            self.addLabel('a', 'b');

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, {
                a: 'b'
            });
        });
    });

    describe('.debug()', () => {
        it('ok', async () => {
            const self = new Self();

            Reflect.set(self, 'log', (arg: any) => {
                const res = arg({
                    debug: 'debug'
                });
                strictEqual(res, 'debug');
            });

            self.debug();
        });
    });

    describe('.error(err: Error)', () => {
        it('ok', async () => {
            const self = new Self();

            Reflect.set(self, 'log', (arg: any) => {
                const res = arg({
                    error: 'error'
                });
                strictEqual(res, 'error');
            });

            const err = new Error('err');
            self.error(err);

            const res = Reflect.get(self, 'm_Labels');
            deepStrictEqual(res, {
                err: err
            });
        });
    });

    describe('.info()', () => {
        it('ok', async () => {
            const self = new Self();

            Reflect.set(self, 'log', (arg: any) => {
                const res = arg({
                    info: 'info'
                });
                strictEqual(res, 'info');
            });

            self.info();
        });
    });

    describe('.warning()', () => {
        it('ok', async () => {
            const self = new Self();

            Reflect.set(self, 'log', (arg: any) => {
                const res = arg({
                    warn: 'warn'
                });
                strictEqual(res, 'warn');
            });

            self.warning();
        });
    });
});
import { notStrictEqual, strictEqual } from 'assert';
import { json } from 'body-parser';
import express from 'express';
import { Server } from 'http';

import { BentAPICaller, CustomError, ErrorCode } from '../../../../src';

let server: Server;

describe('src/plugin/bent/api-caller.ts', () => {
    afterEach(() => {
        server?.close();
    });

    describe('.call<T>(route: string, body: any, ms?: number): Promise<T>', () => {
        it('ok', async () => {
            const app = express();
            app.use(
                json()
            );
            app.post('/:endpoint/:api', async (_, resp) => {
                resp.json({
                    data: 'ok',
                    err: 0
                });
            });
            server = app.listen(65000, '127.0.0.1');

            const res = await new BentAPICaller('http://127.0.0.1:65000').call<string>('/a/b', {});
            strictEqual(res, 'ok');
        });

        it('timeout', async () => {
            const app = express();
            app.use(
                json()
            );
            app.post('/:endpoint/:api', async (_, resp) => {
                setTimeout(() => {
                    resp.json({
                        data: 'ok',
                        err: 0
                    });
                }, BentAPICaller.expires + 300);
            });
            server = app.listen(65000, '127.0.0.1');

            let err: CustomError;
            try {
                await new BentAPICaller('http://127.0.0.1:65000').call<string>('/a/b', {});
            } catch (ex) {
                err = ex;
            }
            notStrictEqual(err, undefined);
            strictEqual(err.code, ErrorCode.Timeout);
        });
    });
});
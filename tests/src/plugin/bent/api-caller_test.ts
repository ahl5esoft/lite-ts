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
            server = express().use(
                json()
            ).post('/:app/:endpoint/:api', async (req, resp) => {
                resp.json({
                    data: `${req.params.app}/${req.params.endpoint}/${req.params.api}`,
                    err: 0
                });
            }).listen(65000, '127.0.0.1');

            const route = 'a/b/c';
            const res = await new BentAPICaller('http://127.0.0.1:65000').call<string>(route, {});
            strictEqual(res, route);
        });

        it('timeout', async () => {
            server = express().use(
                json()
            ).post('/:endpoint/:api', async (_, resp) => {
                setTimeout(() => {
                    resp.json({
                        data: 'ok',
                        err: 0
                    });
                }, BentAPICaller.expires);
            }).listen(65000, '127.0.0.1');

            let err: CustomError;
            try {
                await new BentAPICaller('http://127.0.0.1:65000').call<string>('a/b/c', {}, 300);
            } catch (ex) {
                err = ex;
            }
            notStrictEqual(err, undefined);
            strictEqual(err.code, ErrorCode.Timeout);
        });
    });
});
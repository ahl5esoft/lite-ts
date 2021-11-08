import { strictEqual } from 'assert';
import bent from 'bent';
import express from 'express';
import { Server } from 'http';

import { buildPortExpressOption as self } from './port-option';

describe('src/service/express/port-option.ts', () => {
    describe('.buildPortExpressOption', () => {
        it('ok', async () => {
            const app = express();
            app.get('/', (_: any, resp: any) => {
                resp.send('ok');
            });

            const port = 9999;
            const server = self('test', port, '1.2.3')(app);

            const res = await bent('string', `http://127.0.0.1:${port}`)('/');
            strictEqual(res, 'ok');

            (server as any as Server).close();
        });
    });
});
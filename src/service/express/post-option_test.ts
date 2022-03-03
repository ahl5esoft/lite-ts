import { strictEqual } from 'assert';
import express from 'express';
import supertest from 'supertest';

import { buildPostExpressOption as self } from './post-option';
import { Mock } from '../assert';
import { IApi, ILog } from '../..';

describe('src/service/express/post-option.ts', () => {
    describe('.buildPostExpressOption', () => {
        it('ok', async () => {
            const mockApi = new Mock<IApi>({});
            const mockLog = new Mock<ILog>();
            const app = express();
            self('/:route', () => {
                return mockLog.actual;
            }, async (_: ILog, __: any) => {
                return mockApi.actual;
            })(app);

            const route = '/test';
            mockLog.expectReturn(
                r => r.addLabel('route', route),
                mockLog.actual
            );

            mockApi.expectReturn(
                r => r.call(),
                'ok'
            );

            const res = await new Promise<string>(s => {
                supertest(app).post(route).end((err, resp) => {
                    s(err ? '' : resp.text);
                });
            });
            strictEqual(res, `{"data":"ok","err":0}`);
        });
    });
});
import { strictEqual } from 'assert';
import express from 'express';
import supertest from 'supertest';

import { buildPostExpressOption as self } from './post-option';
import { Mock, mockAny } from '../assert';
import { IApi, LogBase } from '../../contract';

describe('src/service/express/post-option.ts', () => {
    describe('.buildPostExpressOption', () => {
        it('ok', async () => {
            const mockApi = new Mock<IApi>({
                initSession: () => { }
            });
            const mockLog = new Mock<LogBase>();
            const app = express();
            self(mockLog.actual, '/mh/:route', async (_: any) => {
                return mockApi.actual;
            }, (route: string) => {
                return ['/mh/', '/bg/'].some(r => route.startsWith(r));
            })(app);

            const route = '/mh/test';
            mockLog.expectReturn(
                r => r.addLabel('route', route),
                mockLog.actual
            );
            mockLog.expectReturn(
                r => r.addLabel('headers', mockAny),
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
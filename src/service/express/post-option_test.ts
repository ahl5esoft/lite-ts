import { strictEqual } from 'assert';
import express from 'express';
import supertest from 'supertest';

import { buildPostExpressOption as self } from './post-option';
import { Mock } from '..';
import { IApi, ILog, LogFactoryBase } from '../..';

describe('src/service/express/post-option.ts', () => {
    describe('.buildPostExpressOption', () => {
        it('ok', async () => {
            const mockLogFactory = new Mock<LogFactoryBase>();
            const mockApi = new Mock<IApi>({});
            const app = express();
            self(mockLogFactory.actual, '/:route', async (_: ILog, __: any) => {
                return mockApi.actual;
            })(app);

            const mockLog = new Mock<ILog>();
            mockLogFactory.expectReturn(
                r => r.build(),
                mockLog.actual
            );

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
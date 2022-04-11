import { strictEqual } from 'assert';
import express from 'express';
import { initTracer, opentracing } from 'jaeger-client';
import supertest from 'supertest';

import { buildPostExpressOption as self } from './post-option';
import { Mock } from '../assert';
import { buildBodyParserJsonExpressOption } from '../body-parser';
import { IApi, ILog } from '../..';

const tracer = initTracer({
    reporter: {
        collectorEndpoint: 'http://10.10.0.66:14268/api/traces'
    },
    sampler: {
        type: 'const',
        param: 1,
    },
    serviceName: 'lite-ts'
}, {
    tags: {
        version: '9.65.26'
    }
});
opentracing.initGlobalTracer(tracer);

describe('src/service/express/post-option.ts', () => {
    describe('.buildPostExpressOption', () => {
        it('ok', async () => {
            const mockApi = new Mock<IApi>({
                initSession: () => { }
            });
            const mockLog = new Mock<ILog>();
            const app = express();

            buildBodyParserJsonExpressOption({})(app);

            self('/:endpoint/:api', () => {
                return mockLog.actual;
            }, async (_: ILog, __: any) => {
                return mockApi.actual;
            })(app);

            const route = '/endpoint/api';
            mockLog.expectReturn(
                r => r.addLabel('route', route),
                mockLog.actual
            );

            mockApi.expectReturn(
                r => r.call(),
                'ok'
            );

            const res = await new Promise<string>(s => {
                supertest(app).post(route).set('Content-Type', 'application/json').send(
                    JSON.stringify({
                        userID: 'uid'
                    })
                ).end((err, resp) => {
                    s(err ? '' : resp.text);
                });
            });
            strictEqual(res, `{"data":"ok","err":0}`);
        });
    });
});
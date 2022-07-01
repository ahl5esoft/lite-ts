import bent from 'bent';
import { opentracing } from 'jaeger-client';

import { BentTracerRpc as Self } from './tracer-rpc';

describe('src/service/bent/default-rpc.ts', () => {
    describe('.callWithoutThrow<T>(route: string)', () => {
        it('ok', async () => {
            const tracer = opentracing.globalTracer();
            const tracerSpan = tracer.startSpan('rpc');
            const postFunc = bent('http://127.0.0.1:30107', 'json', 'POST', 200);
            const resp = await new Self(tracer, tracerSpan, postFunc).setBody({
                id: 'user-id'
            }).callWithoutThrow<any>('/account/get-user');
            console.log(resp);
        });
    });
});
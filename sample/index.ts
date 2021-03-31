import 'reflect-metadata';

import { strictEqual } from 'assert';
import moment from 'moment';
import Container from 'typedi';

import {
    APICallerBase,
    APIFactory,
    ExpressAPIPort,
    Log4JSTraceFactory,
    MongoStringGenerator,
    OSDirectory,
    OSFile,
    OSNowTime,
    sleep,
    StringGeneratorBase,
    TraceableBentAPICaller,
    traceSpanKey
} from '../src';
import { traceKey } from '../src/runtime/trace-base';

(async () => {
    const idGenerator = new MongoStringGenerator();
    Container.set(StringGeneratorBase, idGenerator);

    const port = 65000;
    const apiCaller = new TraceableBentAPICaller(`http://127.0.0.1:${port}`);
    Container.set(APICallerBase, apiCaller);

    const project = 'lite-ts';
    const apiFactory = new APIFactory();
    await apiFactory.init(
        new OSDirectory(__dirname, 'api')
    );

    const nowTime = new OSNowTime();
    const traceLogFactory = new Log4JSTraceFactory(idGenerator, nowTime);
    const apiPort = new ExpressAPIPort(apiFactory, project, port, traceLogFactory, '0.0.0');

    setTimeout(async () => {
        const res = await apiCaller.setHeaders({
            [traceKey]: 'trace-id',
            [traceSpanKey]: 'span-id'
        }).call(`test/version`);
        strictEqual(res, '1.0.0');

        const file = new OSFile(__dirname, '..', 'log', `trace.${moment().format('yyyy-MM-DD')}`);
        while (true) {
            const isExist = await file.exists();
            if (isExist) {
                const traceLog = await file.readJSON<any>();
                strictEqual(traceLog[0].parentID, 'span-id');
                break;
            }

            await sleep(100);
        }

        await file.remove();

        apiPort.close();
    }, 1000);

    await apiPort.listen();
})();
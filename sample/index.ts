import 'reflect-metadata';
import Container from 'typedi';

import { APIFactory, BentAPICaller, ExpressAPIPort, Log4JSTraceLogFactory, MongoStringGenerator, OSDirectory, OSNowTime, StringGeneratorBase } from '../src';

(async () => {
    const idGenerator = new MongoStringGenerator();
    Container.set(StringGeneratorBase, idGenerator);

    const port = 65000;
    const project = 'lite-ts';
    setTimeout(async () => {
        const res = await new BentAPICaller(`http://127.0.0.1:${port}`).call(`test/version`, {});
        console.log(res);
    }, 1000);

    const apiFactory = new APIFactory();
    await apiFactory.init(
        new OSDirectory(__dirname, 'api')
    );

    const nowTime = new OSNowTime();
    const traceLogFactory = new Log4JSTraceLogFactory(idGenerator, nowTime);
    await new ExpressAPIPort(apiFactory, project, port, traceLogFactory, '0.0.0').listen();
})();
import 'reflect-metadata';

import { deepStrictEqual, strictEqual } from 'assert';
import { addLayout, configure, getLogger } from 'log4js';
import moment from 'moment';
import Container from 'typedi';

import {
    APICallerBase,
    APIFactory,
    BentAPICaller,
    DBFactoryBase,
    ExpressAPIPort,
    Log4JSTraceSpan,
    MongoFactory,
    MongoStringGenerator,
    OSDirectory,
    OSFile,
    OSNowTime,
    sleep,
    StringGeneratorBase,
    Trace,
    TraceableAPICaller,
    TraceableDBFactory,
    TraceFactory,
    traceKey,
    TraceSpanBase,
    traceSpanKey
} from '../src';

(async () => {
    addLayout('json', () => {
        return e => {
            return JSON.stringify(e.data[0]);
        };
    });
    configure({
        appenders: {
            out: {
                alwaysIncludePattern: true,
                filename: 'log/trace',
                layout: {
                    type: 'json',
                },
                pattern: '.yyyy-MM-dd',
                type: 'dateFile',
            }
        },
        categories: {
            default: {
                appenders: ['out'],
                level: 'trace'
            }
        }
    });

    const dbFactory = new MongoFactory('lite-config', 'mongodb://localhost:27017');
    const nowTime = new OSNowTime();
    const stringGenerator = new MongoStringGenerator();
    const traceFactory = new TraceFactory(
        stringGenerator,
        (trace: Trace, name: string, parentID: string): TraceSpanBase => {
            return new Log4JSTraceSpan(
                getLogger(),
                nowTime,
                stringGenerator,
                trace,
                name,
                parentID
            );
        }
    );

    const port = 65000;
    const bentAPICaller = new BentAPICaller(`http://127.0.0.1:${port}`);
    Container.set(
        APICallerBase,
        new TraceableAPICaller(bentAPICaller, traceFactory)
    );

    Container.set(
        DBFactoryBase,
        new TraceableDBFactory(dbFactory, traceFactory)
    );

    Container.set(StringGeneratorBase, stringGenerator);

    const project = 'lite-ts';
    const apiFactory = new APIFactory();
    await apiFactory.init(
        new OSDirectory(__dirname, 'api')
    );

    const apiPort = new ExpressAPIPort(apiFactory, project, port, traceFactory, '0.0.0');

    setTimeout(async () => {
        const traceID = 'trace-id';
        const traceSpanID = 'span-id';
        const res = await bentAPICaller.setHeaders({
            [traceKey]: traceID,
            [traceSpanKey]: traceSpanID
        }).call(`test/version`);
        strictEqual(res, '1.0.0');

        const file = new OSFile(__dirname, '..', 'log', `trace.${moment().format('yyyy-MM-DD')}`);
        while (true) {
            const isExist = await file.exists();
            if (isExist) {
                const traceText = await file.readString();
                const traceLogs = traceText.split(/\n/g).filter(r => r).map(r => {
                    return JSON.parse(r);
                });
                strictEqual(traceLogs.length, 6);
                deepStrictEqual(traceLogs, [{
                    "beganOn": traceLogs[0].beganOn,
                    "endedOn": traceLogs[0].endedOn,
                    "id": traceLogs[0].id,
                    "labels": {
                        "action": "count",
                        "table": "Version",
                    },
                    "name": "db-query",
                    "parentID": traceLogs[traceLogs.length - 1].id,
                    "traceID": traceID
                }, {
                    "beganOn": traceLogs[1].beganOn,
                    "endedOn": traceLogs[1].endedOn,
                    "id": traceLogs[1].id,
                    "labels": {
                        "items": [
                            {
                                "action": "add",
                                "entry": {
                                    "createdOn": 1,
                                    "id": "id-add",
                                    "version": "0.0.1"
                                },
                                "table": "Version"
                            }
                        ],
                    },
                    "name": "uow",
                    "parentID": traceLogs[traceLogs.length - 1].id,
                    "traceID": traceID
                }, {
                    "beganOn": traceLogs[2].beganOn,
                    "endedOn": traceLogs[2].endedOn,
                    "id": traceLogs[2].id,
                    "labels": {
                        "items": [
                            {
                                "action": "save",
                                "entry": {
                                    "createdOn": 2,
                                    "id": "id-add",
                                    "version": "0.0.2"
                                },
                                "table": "Version"
                            }
                        ],
                    },
                    "name": "uow",
                    "parentID": traceLogs[traceLogs.length - 1].id,
                    "traceID": traceID
                }, {
                    "beganOn": traceLogs[3].beganOn,
                    "endedOn": traceLogs[3].endedOn,
                    "id": traceLogs[3].id,
                    "labels": {
                        "items": [
                            {
                                "action": "remove",
                                "entry": {
                                    "createdOn": 2,
                                    "id": "id-add",
                                    "version": "0.0.2"
                                },
                                "table": "Version"
                            }
                        ],
                    },
                    "name": "uow",
                    "parentID": traceLogs[traceLogs.length - 1].id,
                    "traceID": traceID
                }, {
                    "beganOn": traceLogs[4].beganOn,
                    "endedOn": traceLogs[4].endedOn,
                    "id": traceLogs[4].id,
                    "labels": {
                        "items": [
                            {
                                "action": "add",
                                "entry": {
                                    "createdOn": 1,
                                    "id": "id-tx",
                                    "version": "0.0.1"
                                },
                                "table": "Version"
                            },
                            {
                                "action": "remove",
                                "entry": {
                                    "createdOn": 1,
                                    "id": "id-tx",
                                    "version": "0.0.1"
                                },
                                "table": "Version"
                            }
                        ],
                    },
                    "name": "uow",
                    "parentID": traceLogs[traceLogs.length - 1].id,
                    "traceID": traceID
                }, {
                    "id": traceLogs[traceLogs.length - 1].id,
                    "beganOn": traceLogs[traceLogs.length - 1].beganOn,
                    "endedOn": traceLogs[traceLogs.length - 1].endedOn,
                    "labels": {
                        "params": {
                            "endpoint": "test",
                            "api": "version"
                        },
                        "body": {},
                    },
                    "name": "express-api-port",
                    "parentID": traceSpanID,
                    "traceID": traceID
                }]);
                break;
            }

            await sleep(100);
        }

        await file.remove();

        await dbFactory.close();
        apiPort.close();
    }, 1000);

    await apiPort.listen();
})();
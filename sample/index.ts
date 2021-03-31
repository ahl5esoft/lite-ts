import 'reflect-metadata';

import { deepStrictEqual, strictEqual } from 'assert';
import moment from 'moment';
import Container from 'typedi';

import {
    APICallerBase,
    APIFactory,
    DBFactoryBase,
    ExpressAPIPort,
    Log4JSTraceFactory,
    MongoFactory,
    MongoStringGenerator,
    OSDirectory,
    OSFile,
    OSNowTime,
    sleep,
    StringGeneratorBase,
    TraceableBentAPICaller,
    TraceableDBFactory,
    traceSpanKey
} from '../src';
import { traceKey } from '../src/runtime/trace-base';

(async () => {
    const port = 65000;
    const apiCaller = new TraceableBentAPICaller(`http://127.0.0.1:${port}`);
    Container.set(APICallerBase, apiCaller);

    const idGenerator = new MongoStringGenerator();
    Container.set(StringGeneratorBase, idGenerator);

    const dbFactory = new MongoFactory('lite-config', 'mongodb://localhost:27017');
    const nowTime = new OSNowTime();
    const traceFactory = new Log4JSTraceFactory(idGenerator, nowTime);
    Container.set(
        DBFactoryBase,
        new TraceableDBFactory(dbFactory, traceFactory)
    );

    const project = 'lite-ts';
    const apiFactory = new APIFactory();
    await apiFactory.init(
        new OSDirectory(__dirname, 'api')
    );

    const apiPort = new ExpressAPIPort(apiFactory, project, port, traceFactory, '0.0.0');

    setTimeout(async () => {
        const traceID = 'trace-id';
        const traceSpanID = 'span-id';
        const res = await apiCaller.setHeaders({
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
                    labels: {
                        name: "db",
                        beganOn: traceLogs[0].labels.beganOn,
                        query: "count",
                        table: "Version",
                        endedOn: traceLogs[0].labels.endedOn
                    },
                    parentID: traceLogs[traceLogs.length - 1].spanID,
                    spanID: traceLogs[0].spanID,
                    traceID: traceID
                }, {
                    "labels": {
                        "name": "uow",
                        "beganOn": traceLogs[1].labels.beganOn,
                        "actions": [
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
                        "endedOn": traceLogs[1].labels.endedOn,
                    },
                    "parentID": traceLogs[traceLogs.length - 1].spanID,
                    "spanID": traceLogs[1].spanID,
                    "traceID": traceID
                }, {
                    "labels": {
                        "name": "uow",
                        "beganOn": traceLogs[2].labels.beganOn,
                        "actions": [
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
                        "endedOn": traceLogs[2].labels.endedOn,
                    },
                    "parentID": traceLogs[traceLogs.length - 1].spanID,
                    "spanID": traceLogs[2].spanID,
                    "traceID": traceID
                }, {
                    "labels": {
                        "name": "uow",
                        "beganOn": traceLogs[3].labels.beganOn,
                        "actions": [
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
                        "endedOn": traceLogs[3].labels.endedOn
                    },
                    "parentID": traceLogs[traceLogs.length - 1].spanID,
                    "spanID": traceLogs[3].spanID,
                    "traceID": traceID
                }, {
                    "labels": {
                        "name": "uow",
                        "beganOn": traceLogs[4].labels.beganOn,
                        "actions": [
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
                        "endedOn": traceLogs[4].labels.endedOn
                    },
                    "parentID": traceLogs[traceLogs.length - 1].spanID,
                    "spanID": traceLogs[4].spanID,
                    "traceID": traceID
                }, {
                    labels: {
                        name: "lite-ts/test/version",
                        beganOn: traceLogs[traceLogs.length - 1].labels.beganOn,
                        body: {},
                        endedOn: traceLogs[traceLogs.length - 1].labels.endedOn
                    },
                    parentID: traceSpanID,
                    spanID: traceLogs[traceLogs.length - 1].spanID,
                    traceID: traceID
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
import 'reflect-metadata';

import { Express, Request, Response } from 'express';
import Container from 'typedi';

import { enum_ } from './model';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IApiResponse,
    ILog,
    IOFactoryBase,
    LogFactoryBase,
    model,
    service
} from '../../src';

(async () => {
    const cfg = await service.initIoC(__dirname);

    Container.set(
        EnumFactoryBase,
        new service.EnumFactory({
            [enum_.CityData.name]: () => {
                return new service.MongoEnum(
                    Container.get<DbFactoryBase>(DbFactoryBase as any),
                    enum_.CityData.name,
                );
            }
        })
    );

    const ioFactory = Container.get<IOFactoryBase>(IOFactoryBase as any);
    const apiFactory = await service.APIFactory.create(
        ioFactory.buildDirectory(__dirname, 'api'),
    );
    await new service.ExpressApiPort([
        service.buildCorsExpressOption({}),
        service.buildBodyParserJsonExpressOption({
            limit: '16mb'
        }),
        (app: Express) => {
            app.get('/', (_: Request, resp: Response) => {
                resp.json({
                    data: cfg.version,
                    err: 0,
                } as IApiResponse);
            })
        },
        service.buildPostExpressOption('/:endpoint/:api', () => {
            return Container.get<LogFactoryBase>(LogFactoryBase as any).build(model.enum_.LogType.console);
        }, async (log: ILog, req: Request) => {
            log.addLabel('route', req.path);

            const api = apiFactory.build(req.params.endpoint, req.params.api);
            return api;
        }),
        service.buildPortExpressOption(cfg.name, cfg.port, cfg.version)
    ]).listen();
})();
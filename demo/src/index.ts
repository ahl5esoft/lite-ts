import 'reflect-metadata';

import { Express, Request, Response } from 'express';
import Container from 'typedi';

import { enum_ } from './model';
import {
    CacheBase,
    EnumFactoryBase,
    IApiResponse,
    IOFactoryBase,
    LogBase,
    model,
    service
} from '../../src';

(async () => {
    const cfg = await service.initIoC(model.global);

    const enumCache = Container.get<CacheBase>(model.enum_.IoC.enumCache);
    Container.set(
        EnumFactoryBase,
        new service.EnumFactory({
            [enum_.CityData.name]: () => {
                return new service.CacheEnum(enumCache, enum_.CityData.name);
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
        service.buildPostExpressOption(
            Container.get<LogBase>(LogBase as any),
            '/:endpoint/:api',
            async (req: Request) => {
                return apiFactory.build(req.params.endpoint, req.params.api);
            }),
        service.buildPortExpressOption(cfg.name, cfg.port, cfg.version)
    ]).listen();
})();
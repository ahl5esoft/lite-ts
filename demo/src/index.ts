import 'reflect-metadata';

import { Express, Request, Response } from 'express';
import Container from 'typedi';

import { enum_ } from './model';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IApiResponse,
    IOFactoryBase,
    LogBase,
    model,
    RedisBase,
    service
} from '../../src';

(async () => {
    const cfg = await service.initIoC();

    const dbFactory = Container.get<DbFactoryBase>(DbFactoryBase as any);
    const enumDataSource = new service.MongoEnumDataSource(dbFactory, '-');
    const redis = Container.get<RedisBase>(RedisBase as any);
    const redisCache = new service.RedisCase(redis, async () => {
        return enumDataSource.findEnums();
    }, model.global.Enum.name);
    Container.set(
        EnumFactoryBase,
        new service.EnumFactory({
            [enum_.CityData.name]: () => {
                return new service.CacheEnum(redisCache, enum_.CityData.name);
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
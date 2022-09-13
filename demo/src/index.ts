import 'reflect-metadata';

import { Request } from 'express';
import Container from 'typedi';

import { enum_ } from './model';
import {
    CacheBase,
    EnumFactoryBase,
    IOFactoryBase,
    LogBase,
    model,
    RpcBase,
    service,
    ThreadBase
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
        }, null)
    );

    const ioFactory = Container.get<IOFactoryBase>(IOFactoryBase as any);
    const apiFactory = await service.createApiFactory(
        ioFactory.buildDirectory(__dirname, 'api'),
    );
    new service.ExpressApiPort([
        service.buildCorsExpressOption({}),
        service.buildBodyParserJsonExpressOption({
            limit: '16mb'
        }),
        service.buildPostExpressOption(
            Container.get<LogBase>(LogBase as any),
            '/:endpoint/:api',
            async (req: Request) => {
                return apiFactory.build(req.params.endpoint, req.params.api);
            }),
        service.buildPortExpressOption(cfg.name, cfg.port.http, cfg.version)
    ]).listen().catch(console.error);

    await Container.get<ThreadBase>(ThreadBase as any).sleep(1000);

    const res = await Container.get<RpcBase>(RpcBase as any).callWithoutThrow<any>('/test/now-time');
    console.log(res);
})();
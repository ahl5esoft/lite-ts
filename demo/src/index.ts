import 'reflect-metadata';

import { Request } from 'express';
import Container from 'typedi';

import { enum_ } from './model';
import {
    CacheBase,
    CryptoBase,
    EnumFactoryBase,
    FileFactoryBase,
    LogFactoryBase,
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
        new service.EnumFactory(null, {}, {
            [enum_.CityData.name]: new service.CacheEnum(enumCache, enum_.CityData)
        })
    );

    const fileFactory = Container.get<FileFactoryBase>(FileFactoryBase as any);
    const apiFactory = await service.createApiFactory(
        fileFactory.buildDirectory(__dirname, 'api'),
    );
    new service.ExpressApiPort([
        service.corsExpressOption({}),
        service.bodyParserJsonExpressOption({
            limit: '16mb'
        }),
        service.expressPostOption(
            Container.get<CryptoBase>(model.enum_.IoC.authCrypto),
            Container.get<LogFactoryBase>(LogFactoryBase as any),
            '/:endpoint/:api',
            async (req: Request) => {
                return apiFactory.build(req.params.endpoint, req.params.api);
            },
            null,
        ),
        service.expressPortOption(cfg.name, cfg.port.http, cfg.version)
    ]).listen().catch(console.error);

    await Container.get<ThreadBase>(ThreadBase as any).sleep(1000);

    const res = await Container.get<RpcBase>(RpcBase as any).callWithoutThrow<any>({
        route: '/test/now-time'
    });
    console.log(res);

    process.exit();
})();
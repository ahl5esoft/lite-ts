import 'reflect-metadata';

import { join } from 'path';
import Container from 'typedi';

import { IOFactoryBase, model, RpcBase, service } from '../../src';

(async () => {
    const cfg = await service.initIoC(model.global);

    const ioFactory = Container.get<IOFactoryBase>(IOFactoryBase as any);
    const apiFactory = await service.createApiFactory(
        ioFactory.buildDirectory(__dirname, 'api')
    );
    const protoFilePath = join(__dirname, 'rpc.proto');
    new service.GrpcJsApiPort(apiFactory, cfg.port.grpc, 'lite-ts', cfg.version, protoFilePath).listen().catch(console.error);

    const res = await Container.get<RpcBase>(RpcBase as any).callWithoutThrow<any>({
        body: {
            name: 'test'
        },
        route: '/test/now-time'
    });
    console.log(res);

    process.exit();
})();
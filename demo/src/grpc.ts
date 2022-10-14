import 'reflect-metadata';

import { join } from 'path';
import Container from 'typedi';

import { FileFactoryBase, model, RpcBase, service } from '../../src';

(async () => {
    const cfg = await service.initIoC(model.global);

    const fileFactory = Container.get<FileFactoryBase>(FileFactoryBase as any);
    const apiFactory = await service.createApiFactory(
        fileFactory.buildDirectory(__dirname, 'api')
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
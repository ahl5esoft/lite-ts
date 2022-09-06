import 'reflect-metadata';

import { join } from 'path';
import Container from 'typedi';

import { ConfigLoaderBase, model, service } from '../../src';

(async () => {
    const cfg = await service.initIoC(model.global);

    const ioFactory = new service.FSIOFactory();
    const apiFactory = await service.createApiFactory(
        ioFactory.buildDirectory(__dirname, 'api')
    )
    const protoFilePath = join(__dirname, 'rpc.proto');
    new service.GrpcjsApiPort(apiFactory, cfg.port.grpc, protoFilePath).listen().catch(console.error);

    const configLoader = Container.get<ConfigLoaderBase>(ConfigLoaderBase as any);
    const res = await new service.GrpcjsRpc(configLoader, protoFilePath).setBody({
        name: 'test'
    }).callWithoutThrow<any>('/test/now-time');
    console.log(res);

    process.exit();
})();
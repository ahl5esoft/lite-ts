import { initTracer, opentracing } from 'jaeger-client';
import Container from 'typedi';

import {
    BentRpc,
    ConsoleLog,
    DateNowTime,
    FSIOFactory,
    IoredisAdapter,
    JaegerDbFactory,
    LogFactory,
    MongoDbFactory,
    MongoStringGenerator,
    RedisNowTime,
    SetTimeoutThread,
    YamlConfigFactory
} from '..';
import {
    ConfigFactoryBase,
    DbFactoryBase,
    IOFactoryBase,
    LogFactoryBase,
    model,
    NowTimeBase,
    RedisBase,
    RpcBase,
    StringGeneratorBase,
    ThreadBase
} from '../..';

/**
 * 初始化IoC
 */
export async function initIoC(rootDirPath: string) {
    const ioFactory = new FSIOFactory();
    Container.set(IOFactoryBase, ioFactory);

    const isTest = process.argv.some(r => {
        return r.endsWith('mocha');
    });
    const configFactory = new YamlConfigFactory(
        ioFactory.buildFile(rootDirPath, '..', `config${isTest ? '-it' : ''}.yaml`)
    );
    Container.set(ConfigFactoryBase, configFactory);

    const cfg = await configFactory.build(model.config.Default).get();

    const pkg = await ioFactory.buildFile(rootDirPath, '..', 'package.json').readJSON<{ version: string }>();
    cfg.version = pkg.version;

    if (cfg.openTracing) {
        cfg.openTracing.config.serviceName = cfg.name;

        if (!cfg.openTracing.options)
            cfg.openTracing.options = {};
        if (!cfg.openTracing.options.tags)
            cfg.openTracing.options.tags = {};
        cfg.openTracing.options.tags.version = cfg.version;

        const tracer = initTracer(cfg.openTracing.config, cfg.openTracing.options);
        opentracing.initGlobalTracer(tracer);
    }

    if (cfg.gatewayUrl) {
        const rpc = new BentRpc(cfg.gatewayUrl);
        Container.set(RpcBase, rpc);
    }

    if (cfg.mongo) {
        const dbFactory = new MongoDbFactory(cfg.name, cfg.mongo);
        Container.set(
            DbFactoryBase,
            new JaegerDbFactory(dbFactory)
        );
    }

    if (cfg.redis) {
        const redis = new IoredisAdapter(cfg.redis);
        Container.set(RedisBase, redis);

        Container.set(
            NowTimeBase,
            new RedisNowTime(redis)
        );
    } else {
        Container.set(
            NowTimeBase,
            new DateNowTime()
        );
    }

    Container.set(
        LogFactoryBase,
        new LogFactory({
            [model.enum_.LogType.console]: () => {
                return new ConsoleLog();
            }
        })
    );

    Container.set(
        StringGeneratorBase,
        new MongoStringGenerator()
    );
    Container.set(
        ThreadBase,
        new SetTimeoutThread()
    );

    return cfg;
}
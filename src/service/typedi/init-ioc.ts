import { initTracer, opentracing } from 'jaeger-client';
import Container from 'typedi';

import { BentRpc } from '../bent';
import { ConsoleLog } from '../console';
import { DateNowTime } from '../date';
import { FSIOFactory } from '../fs';
import { IoredisAdapter } from '../ioredis';
import { JaegerDbFactory, JeagerRedis } from '../jaeger';
import { JsYamlConfigLoader } from '../js-yaml';
import { LogProxy } from '../log';
import { MongoDbFactory, MongoStringGenerator } from '../mongo';
import { RedisNowTime } from '../redis';
import { SetTimeoutThread } from '../set-timeout';
import {
    ConfigLoaderBase,
    DbFactoryBase,
    IOFactoryBase,
    LogBase,
    NowTimeBase,
    RedisBase,
    RpcBase,
    StringGeneratorBase,
    ThreadBase
} from '../../contract';
import { config } from '../../model';

/**
 * 初始化IoC
 * 
 * @param rootDirPath 根目录, 默认: process.cwd()
 */
export async function initIoC(rootDirPath?: string) {
    rootDirPath ??= process.cwd();

    const ioFactory = new FSIOFactory();
    Container.set(IOFactoryBase, ioFactory);

    let yamlFilename = 'config.yaml';
    for (const r of process.argv) {
        if (r.includes('.yaml')) {
            yamlFilename = r;
            break;
        } else if (r.endsWith('mocha')) {
            yamlFilename = 'config-it.yaml';
            break;
        }
    }
    const configLaoder = new JsYamlConfigLoader(
        ioFactory.buildFile(rootDirPath, yamlFilename)
    );
    Container.set(ConfigLoaderBase, configLaoder);

    const cfg = await configLaoder.load(config.Default);

    const pkg = await ioFactory.buildFile(rootDirPath, 'package.json').readJSON<{ version: string }>();
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
        Container.set(
            RedisBase,
            new JeagerRedis(redis)
        );

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
        LogBase,
        new LogProxy(
            () => new ConsoleLog()
        )
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
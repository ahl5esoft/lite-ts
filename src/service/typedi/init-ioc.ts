import { initTracer, opentracing } from 'jaeger-client';
import Container from 'typedi';

import { BentRpc } from '../bent';
import { ConsoleLog } from '../console';
import { DateNowTime } from '../date';
import { DbUserRandSeedService } from '../db';
import { FSIOFactory } from '../fs';
import { IoredisAdapter } from '../ioredis';
import { JaegerDbFactory, JeagerRedis } from '../jaeger';
import { JsYamlConfigLoader } from '../js-yaml';
import { LogProxy } from '../log';
import { loadMongoConfigDataSource, MongoDbFactory, MongoEnumDataSource, MongoStringGenerator } from '../mongo';
import { RedisCache, RedisLock, RedisNowTime } from '../redis';
import { SetTimeoutThread } from '../set-timeout';
import {
    ConfigLoaderBase,
    DbFactoryBase,
    IOFactoryBase,
    IUserAssociateService,
    LockBase,
    LogBase,
    NowTimeBase,
    RedisBase,
    RpcBase,
    StringGeneratorBase,
    ThreadBase,
    UserServiceBase
} from '../../contract';
import { config, enum_, global } from '../../model';

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

    const mongo = cfg.distributedMongo || cfg.mongo;
    let dbFactory: DbFactoryBase;
    if (mongo) {
        dbFactory = new MongoDbFactory(!!cfg.distributedMongo, cfg.name, mongo);
        Container.set(
            DbFactoryBase,
            new JaegerDbFactory(dbFactory)
        );
    }

    let redis: RedisBase;
    let nowTime: NowTimeBase;
    if (cfg.redis) {
        redis = new IoredisAdapter(cfg.redis);
        Container.set(
            RedisBase,
            new JeagerRedis(redis)
        );

        nowTime = new RedisNowTime(redis);

        Container.set(
            LockBase,
            new RedisLock(redis)
        );
    } else {
        nowTime = new DateNowTime();
    }
    Container.set(NowTimeBase, nowTime);

    if (redis && dbFactory.constructor == MongoDbFactory) {
        const configCache = new RedisCache(nowTime, redis, () => {
            return loadMongoConfigDataSource(dbFactory);
        }, `${cfg.name}:${global.Config.name}`);
        Container.set(enum_.IoC.configCache, configCache);

        const enumCache = new RedisCache(nowTime, redis, () => {
            return new MongoEnumDataSource(dbFactory, '-').findEnums();
        }, `${cfg.name}:${global.Enum.name}`);
        Container.set(enum_.IoC.enumCache, enumCache);
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

    UserServiceBase.buildRandServiceFunc = (associateService: IUserAssociateService, scene: string, userID: string, range: [number, number]) => {
        return new DbUserRandSeedService(associateService, dbFactory, scene, userID, range);
    };

    return cfg;
}
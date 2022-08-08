import { initTracer, opentracing } from 'jaeger-client';
import Container from 'typedi';

import { BentRpc } from '../bent';
import { ConsoleLog } from '../console';
import { DateNowTime } from '../date';
import { DbUserRandSeedService, DbUserRewardService, DbUserService } from '../db';
import { FSIOFactory } from '../fs';
import { IoredisAdapter } from '../ioredis';
import { JaegerDbFactory, JeagerRedis } from '../jaeger';
import { JsYamlConfigLoader } from '../js-yaml';
import { LogProxy } from '../log';
import { Log4jsLog } from '../log4js';
import { loadMongoConfigDataSource, MongoDbFactory, MongoEnumDataSource, MongoStringGenerator } from '../mongo';
import { RedisCache, RedisLock, RedisNowTime } from '../redis';
import { RpcUserPortraitService, RpcValueService } from '../rpc';
import { SetTimeoutThread } from '../set-timeout';
import {
    ConfigLoaderBase,
    DbFactoryBase,
    EnumFactoryBase,
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
 * @param globalModel 全局模型
 */
export async function initIoC(globalModel: { [name: string]: any }) {
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
        ioFactory.buildFile(
            process.cwd(),
            yamlFilename
        )
    );
    Container.set(ConfigLoaderBase, configLaoder);

    const cfg = await configLaoder.load(config.Default);
    const pkg = await ioFactory.buildFile(
        process.cwd(),
        'package.json'
    ).readJSON<{ version: string }>();
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

    if (redis && dbFactory?.constructor == MongoDbFactory) {
        const configCache = new RedisCache(nowTime, redis, () => {
            return loadMongoConfigDataSource(dbFactory, globalModel[cfg.configModel] ?? global.Config);
        }, `${cfg.name}:${cfg.configModel ?? global.Config.name}`);
        Container.set(enum_.IoC.configCache, configCache);

        const enumCache = new RedisCache(nowTime, redis, () => {
            return new MongoEnumDataSource(dbFactory, '-', globalModel[cfg.enumModel] ?? global.Enum).findEnums();
        }, `${cfg.name}:${cfg.enumModel ?? global.Enum.name}`);
        Container.set(enum_.IoC.enumCache, enumCache);
    }

    let buildLogFunc: () => LogBase;
    if (cfg.log4js) {
        Log4jsLog.init(cfg.log4js);
        buildLogFunc = () => new Log4jsLog();
    } else {
        buildLogFunc = () => new ConsoleLog();
    }
    Container.set(
        LogBase,
        new LogProxy(buildLogFunc)
    );

    Container.set(
        StringGeneratorBase,
        new MongoStringGenerator()
    );

    Container.set(
        ThreadBase,
        new SetTimeoutThread()
    );

    UserServiceBase.buildPortraitServiceFunc = (rpc: RpcBase, userID: string) => {
        return new RpcUserPortraitService(rpc, userID);
    };
    UserServiceBase.buildRandServiceFunc = (associateService: IUserAssociateService, scene: string, userID: string, range: [number, number]) => {
        return new DbUserRandSeedService(associateService, dbFactory, scene, userID, range);
    };
    UserServiceBase.buildRewardServiceFunc = (enumFactory: EnumFactoryBase, userService: UserServiceBase) => {
        return new DbUserRewardService(enumFactory, userService);
    };
    DbUserService.buildTargetValueServiceFunc = (enumFactory: EnumFactoryBase, rpc: RpcBase, userService: UserServiceBase, targetTypeData: enum_.TargetTypeData, userID: string) => {
        return new RpcValueService(
            rpc,
            userService,
            targetTypeData,
            { userID, } as global.UserTargetValue,
            enumFactory,
            Container.get<NowTimeBase>(NowTimeBase as any),
        );
    }

    return cfg;
}
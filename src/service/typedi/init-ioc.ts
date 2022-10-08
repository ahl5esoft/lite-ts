import { initTracer, opentracing } from 'jaeger-client';
import moment from 'moment';
import { join } from 'path';
import Container from 'typedi';

import { BentConfigLoader, BentRpc } from '../bent';
import { CacheConfigLoader } from '../cache';
import { ConfigLoadBalance, MultiConfigLoader } from '../config';
import { ConsoleLog } from '../console';
import { DateNowTime } from '../date';
import { DbUserRandSeedService, DbUserRewardService, DbUserService } from '../db';
import { CustomError } from '../error';
import { FSIOFactory } from '../fs';
import { GrpcJsRpc } from '../grpc-js';
import { IoredisAdapter } from '../ioredis';
import { JaegerDbFactory, JeagerRedis, JeagerRpc } from '../jaeger';
import { JsYamlConfigLoader } from '../js-yaml';
import { LogProxy } from '../log';
import { Log4jsLog } from '../log4js';
import { MongoConfigCache, MongoDbFactory, MongoEnumCache, MongoStringGenerator } from '../mongo';
import { RedisLock, RedisNowTime } from '../redis';
import { RpcUserPortraitService, RpcValueService } from '../rpc';
import { SetTimeoutThread } from '../set-timeout';
import { UserCustomGiftBagService } from '../user';
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
    UserServiceBase,
    ValueTypeServiceBase
} from '../../contract';
import { config, enum_, global } from '../../model';

/**
 * 初始化IoC
 * 
 * @param globalModel 全局模型
 */
export async function initIoC(globalModel: { [name: string]: any }) {
    moment.updateLocale('en', {
        week: {
            dow: 1,
        }
    });

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
    const configLoaders: ConfigLoaderBase[] = [
        new JsYamlConfigLoader(
            ioFactory.buildFile(
                process.cwd(),
                yamlFilename
            )
        )
    ];

    const cfg = await configLoaders[0].load(config.Default);
    const pkg = await ioFactory.buildFile(
        process.cwd(),
        'package.json'
    ).readJSON<{ version: string }>();
    cfg.version = pkg.version;

    if (cfg.cdnUrl) {
        configLoaders.push(
            new BentConfigLoader(cfg.cdnUrl)
        );
    }

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

    Container.set(
        RpcBase,
        new JeagerRpc(() => {
            const configLoader = Container.get<ConfigLoaderBase>(ConfigLoaderBase as any);
            return cfg.grpcProtoFilePath ? new GrpcJsRpc(
                new ConfigLoadBalance(configLoader, 'grpc'),
                join(__dirname, cfg.grpcProtoFilePath),
            ) : new BentRpc(
                new ConfigLoadBalance(configLoader, 'http')
            );
        }, null)
    );

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
        const configCache = new MongoConfigCache(
            dbFactory,
            globalModel[cfg.configModel] ?? global.Config,
            redis,
            `${cfg.name}:${cfg.configModel ?? global.Config.name}`
        );
        Container.set(enum_.IoC.configCache, configCache);

        configLoaders.push(
            new CacheConfigLoader(configCache)
        );

        Container.set(
            enum_.IoC.enumCache,
            new MongoEnumCache(
                dbFactory,
                globalModel[cfg.enumModel] ?? global.Enum,
                redis,
                `${cfg.name}:${cfg.enumModel ?? global.Enum.name}`,
                '-'
            )
        );
    }

    Container.set(
        ConfigLoaderBase,
        new MultiConfigLoader(configLoaders)
    );

    if (cfg.log4js)
        Log4jsLog.init(cfg.log4js);

    Container.set(
        LogBase,
        new LogProxy(() => {
            return cfg.log4js ? new Log4jsLog() : new ConsoleLog()
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

    RpcBase.buildErrorFunc = (errCode, data) => new CustomError(errCode, data);

    UserServiceBase.buildCustomGiftBagServiceFunc = (dbFactory: DbFactoryBase, entry: global.UserCustomGiftBag) => {
        return new UserCustomGiftBagService(dbFactory, entry);
    };
    UserServiceBase.buildPortraitServiceFunc = (rpc: RpcBase, userID: string) => {
        return new RpcUserPortraitService(rpc, userID);
    };
    UserServiceBase.buildRandServiceFunc = (associateService: IUserAssociateService, scene: string, userID: string, range: [number, number]) => {
        return new DbUserRandSeedService(associateService, dbFactory, scene, userID, range);
    };
    UserServiceBase.buildRewardServiceFunc = (userService: UserServiceBase, valueTypeService: ValueTypeServiceBase) => {
        return new DbUserRewardService(userService, valueTypeService);
    };
    DbUserService.buildTargetValueServiceFunc = (enumFactory: EnumFactoryBase, rpc: RpcBase, userService: UserServiceBase, targetTypeData: enum_.TargetTypeData, userID: string) => {
        return new RpcValueService(
            rpc,
            userService,
            {
                ...targetTypeData,
                key: [global.UserTargetValue.name, targetTypeData.value].join('-'),
            },
            { userID } as global.UserTargetValue,
            enumFactory,
        );
    }

    return cfg;
}
import 'reflect-metadata';

import Container from 'typedi';

import { APIGetter } from '../api';
import { OSDirectory, OSFile } from '../io/os';
import { DbFactoryBase } from '../plugin/db';
import { MongoFactory } from '../plugin/db/mongo';
import { IORedis, RedisBase } from '../plugin/redis';

class Package {
    public branch: string;

    public mongo: {
        name: string;
        url: string;
    };

    public redis: {
        host: string;
        port: number;
    };

    public port: number;
}

(async (): Promise<void> => {
    const apiGetter = new APIGetter(__dirname, 'api');
    Container.set(APIGetter, apiGetter);

    const uploadDir = new OSDirectory(__dirname, 'upload');
    await uploadDir.create();

    const pkg = await new OSFile(__dirname, 'package.json').readJSON<Package>();

    const mongo = new MongoFactory(pkg.mongo.name, pkg.mongo.url);
    Container.set(DbFactoryBase, mongo);
    // server.exitActions.push((): void => {
    //     mongo.close().catch(console.error);
    // });

    const redis = new IORedis(pkg.redis);
    Container.set(RedisBase, redis);
    // server.exitActions.push((): void => {
    //     redis.close();
    // });

})();
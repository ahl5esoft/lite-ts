import 'reflect-metadata';

import { join } from 'path';
import Container from 'typedi';

import { APIGetter } from '../api';
import { OSFile } from '../io/os';
import { ExpressStartupHandler, IExpressStartupContext } from '../plugin/express';
import { IMongoStartupContext, MongoStartupHandler } from '../plugin/db/mongo';
import { IRedisStartupContext, RedisStartupHandler } from '../plugin/redis';

class StartupContext implements IExpressStartupContext, IMongoStartupContext, IRedisStartupContext {
    private m_ReleaseActions: (() => Promise<void>)[] = [];

    public controllers: Function[];

    public host: string;

    public mongo: any;

    public port: number;

    public redis: any;

    public staticDirPath?: string;

    public get uploadDirPath(): string {
        return join(__dirname, 'upload');
    }

    public addReleaseRedis(action: () => Promise<void>): void {
        this.m_ReleaseActions.push(action);
    }

    public async onExit(): Promise<void> {
        for (const r of this.m_ReleaseActions) {
            await r();
        }
    }

    public setReleaseMongo(action: () => Promise<void>): void {
        this.m_ReleaseActions.push(action);
    }
}

(async (): Promise<void> => {
    Container.set(
        APIGetter,
        new APIGetter(__dirname, 'api')
    );

    const pkg = await new OSFile(__dirname, 'package.json').readJSON<StartupContext>();
    const ctx = Object.assign(
        new StartupContext(),
        pkg
    );
    await new MongoStartupHandler().setNext(
        new RedisStartupHandler()
    ).setNext(
        new ExpressStartupHandler()
    ).handle(ctx);
})();
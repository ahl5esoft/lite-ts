import Container from 'typedi';

import { MongoFactory } from './factory';
import { DbFactoryBase } from '../factory-base';
import { CORHandlerBase } from '../../../dp/cor';

export class MongoStartupHandler extends CORHandlerBase {
    protected async handling(ctx: IMongoStartupContext): Promise<void> {
        if (!ctx.mongo)
            return;

        const mongo = new MongoFactory(ctx.mongo.name, ctx.mongo.url);
        Container.set(DbFactoryBase, mongo);

        ctx.setReleaseMongo(async (): Promise<void> => {
            await mongo.close();
        });
    }
}

export interface IMongoStartupContext {
    mongo: {
        name: string;
        url: string;
    };
    setReleaseMongo(action: () => Promise<void>): void;
}
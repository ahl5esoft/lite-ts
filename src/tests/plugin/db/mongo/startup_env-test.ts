import { notStrictEqual, ok } from 'assert';
import Container from 'typedi';

import { DbFactoryBase } from '../../../../plugin/db';
import { MongoStartupHandler } from '../../../../plugin/db/mongo';

describe('src/plugin/db/mongo/startup.ts', (): void => {
    describe('.handling(ctx: IStartupContext): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            let releaseAction: () => Promise<void>;
            await new MongoStartupHandler().handle({
                mongo: {
                    name: 'lite-ts',
                    url: 'mongodb://localhost:27017'
                },
                setReleaseMongo: (action: () => Promise<void>): void => {
                    releaseAction = action;
                }
            });
            if (releaseAction)
                await releaseAction();

            ok(
                Container.has(DbFactoryBase as any)
            );
            notStrictEqual(releaseAction, undefined);
        });
    });
});
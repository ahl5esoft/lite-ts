import * as express from 'express';
import { useContainer, useExpressServer } from 'routing-controllers';
import Container from 'typedi';

import { CORHandlerBase } from '../../dp/cor';

export class ExpressStartupHandler extends CORHandlerBase<IExpressStartupContext> {
    protected async handling(ctx: IExpressStartupContext): Promise<void> {
        process.on('SIGINT', (): void => {
            ctx.onExit();
            process.exit(0);
        });

        useContainer(Container);

        const app = express();
        if (ctx.staticDirPath) {
            app.use(
                express.static(ctx.staticDirPath)
            );
        }

        const listenArgs: any[] = [
            ctx.port,
            (): void => {
                console.log(`${ctx.project}(v${ctx.version}): ${ctx.port}`);
            },
        ];
        if (ctx.host == '127.0.0.1')
            listenArgs.splice(1, 0, ctx.host);
        useExpressServer(app, {
            controllers: ctx.controllers,
        }).listen(...listenArgs);
    }
}

export interface IExpressStartupContext {
    controllers: Function[];
    host: string;
    project: string;
    port: number;
    version: string;
    staticDirPath?: string;

    onExit(): void;
}
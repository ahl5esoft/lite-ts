import * as express from 'express';
import { useContainer, useExpressServer } from 'routing-controllers';
import Container from 'typedi';

import { middleware } from './file-upload-middleware';
import { PostController } from './post-controller';
import { APIGetter } from '../../api';
import { CORHandlerBase } from '../../dp/cor';
import { OSDirectory } from '../../io/os';

export class ExpressStartupHandler extends CORHandlerBase {
    protected async handling(ctx: IExpressStartupContext): Promise<void> {
        process.on('SIGINT', (): void => {
            ctx.onExit().catch(console.error);
            process.exit(0);
        });

        useContainer(Container);

        const app = express();
        if (ctx.staticDirPath) {
            app.use(
                express.static(ctx.staticDirPath)
            );
        }

        if (!ctx.controllers) {
            if (!Container.has(APIGetter))
                throw new Error('typedi: 未知APIGetter');

            middleware.apiGetter = Container.get(APIGetter);

            if (!ctx.uploadDirPath)
                throw new Error('缺少IExpressStartupContext.uploadDirPath');

            await new OSDirectory(ctx.uploadDirPath).create();
            middleware.uploadDirPath = ctx.uploadDirPath;

            ctx.controllers = [PostController];
        }

        const listenArgs: any[] = [
            ctx.port,
            (): void => {
                console.log(`${ctx.host}:${ctx.port}`);
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
    host: string;
    port: number;
    controllers?: Function[];
    staticDirPath?: string;
    uploadDirPath?: string;

    onExit(): Promise<void>;
}
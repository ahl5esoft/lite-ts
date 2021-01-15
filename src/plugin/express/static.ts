import * as express from 'express';

import { ExpressServer, ExpressServerRunOption } from './server';

export function newStaticExpressServerRunOption(staticDirPath: string): ExpressServerRunOption {
    return async (server: ExpressServer): Promise<void> => {
        server.app.use(
            express.static(staticDirPath)
        );
    };
}
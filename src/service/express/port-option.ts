import { Express } from 'express';
import moment from 'moment';

import { ExpressOption } from './option';

export function buildPortExpressOption(project: string, port: number, version: string): ExpressOption {
    return function (app: Express) {
        const args: any[] = [port, () => {
            console.log(`${project}(v${version})[${moment().format('YYYY-MM-DD HH:mm:ss')}]: ${port}`);
        }];
        if (process.platform == 'win32')
            args.splice(1, 0, '127.0.0.1');
        return app.listen(...args);
    }
}
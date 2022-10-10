import { Express } from 'express';
import moment from 'moment';

export function expressPortOption(project: string, port: number, version: string) {
    return function (app: Express) {
        const args: any[] = [port, () => {
            console.log(`express >> ${project}(v${version})[${moment().format('YYYY-MM-DD HH:mm:ss')}]: ${port}`);
        }];
        if (process.platform == 'win32')
            args.splice(1, 0, '127.0.0.1');
        return app.listen(...args);
    }
}
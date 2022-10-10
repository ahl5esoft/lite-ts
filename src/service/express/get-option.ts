import { Express, Request, Response } from 'express';

import { contract } from '../../model';

export function expressGetOption(v: any) {
    return function (app: Express) {
        app.get('/', (_: Request, resp: Response) => {
            resp.json({
                data: v,
                err: 0,
            } as contract.IApiResponse);
        });
    }
}
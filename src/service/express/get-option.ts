import { Express, Request, Response } from 'express';

import { contract } from '../../model';

/**
 * 创建get express选项
 * 
 * @param data 下发数据
 */
export function buildGetExpressOption(data: any) {
    return function (app: Express) {
        app.get('/', (_: Request, resp: Response) => {
            resp.json({
                data: data,
                err: 0,
            } as contract.IApiResponse);
        });
    }
}
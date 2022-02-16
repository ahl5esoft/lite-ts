import { Express, Request, Response } from 'express';

import { IApiResponse } from '../..';

/**
 * 创建获取版本express选项
 * 
 * @param version 版本
 */
export function buildGetVersionExpressOption(version: string) {
    return function (app: Express) {
        app.get('/', (_: Request, resp: Response) => {
            resp.json({
                data: version,
                err: 0,
            } as IApiResponse);
        });
    }
}
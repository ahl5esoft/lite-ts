import express from 'express';

import { ExpressOption } from '.';
import { IApiPort } from '../..';

/**
 * api端
 */
export class ExpressApiPort implements IApiPort {
    /**
     * 构造函数
     * 
     * @param m_Options 选项数组
     */
    public constructor(
        private m_Options: ExpressOption[]
    ) { }

    /**
     * 监听
     */
    public async listen() {
        const app = express();
        for (let r of this.m_Options)
            r(app);
    }
}
import express from 'express';

import { ExpressOption } from '.';
import { IApiPort } from '../..';

export class ExpressApiPort implements IApiPort {
    public constructor(
        private m_Options: ExpressOption[]
    ) { }

    public async listen() {
        const app = express();
        for (let r of this.m_Options)
            r(app);
    }
}
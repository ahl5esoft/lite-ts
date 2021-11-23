import express from 'express';

import { IApiPort, service } from '../..';

export class ExpressApiPort implements IApiPort {
    public constructor(
        private m_Options: service.ExpressOption[]
    ) { }

    public async listen() {
        const app = express();
        for (let r of this.m_Options)
            r(app);
    }
}
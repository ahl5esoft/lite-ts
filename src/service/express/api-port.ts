import express from 'express';

import { ExpressOption } from './option';
import { IAPIPort } from '../../contract';

export class ExpressAPIPort implements IAPIPort {
    public constructor(
        private m_Options: ExpressOption[]
    ) { }

    public async listen() {
        const app = express();
        for (let r of this.m_Options)
            r(app);
    }
}
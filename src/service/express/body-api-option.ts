import { Request } from 'express';

import { IAPIPort } from '../../contract';

export async function expressBodyAPIOption(api: IAPIPort, req: Request) {
    Object.keys(req.body).forEach(r => {
        if (r in api)
            return;

        api[r] = req.body[r];
    });
}
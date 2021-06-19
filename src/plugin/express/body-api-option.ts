import { Request } from 'express';

import { IAPI } from '../../api';

export async function expressBodyAPIOption(api: IAPI, req: Request) {
    Object.keys(req.body).forEach(r => {
        if (r in api)
            return;

        api[r] = req.body[r];
    });
}
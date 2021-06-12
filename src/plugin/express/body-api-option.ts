import { Request } from 'express';

import { IAPI } from '../../api';

export async function expressBodyAPIOption(api: IAPI, req: Request) {
    Object.keys(api).forEach(r => {
        if (r in req.body)
            api[r] = req.body[r];
    });
}
import { Request } from 'express';

import { APIOption } from '../../api';
import { IAPI } from '../../api/i-api';

export function ExpressBodyAPIOption(req: Request): APIOption {
    return function (api: IAPI) {
        Object.keys(api).forEach(r => {
            if (r in req.body)
                api[r] = req.body[r];
        });
    }
}
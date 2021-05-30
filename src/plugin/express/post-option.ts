import { Express } from 'express';

import { ExpressOption } from './option';
import { APIFactory, APIOption } from '../../api';

export function ExpressPostOption(apiFactory: APIFactory, ...options: APIOption[]): ExpressOption {
    return function (app: Express) {
        app.post('/:endpoint/:api', async (req, resp) => {
            const api = apiFactory.build(req.params.endpoint, req.params.api);
            for (const r of options)
                r(api);

            const res = await api.call();
            resp.json(res);
        });
    }
}
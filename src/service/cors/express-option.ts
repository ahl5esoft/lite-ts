import cors from 'cors';
import { Express } from 'express';

export function corsExpressOption(app: Express) {
    app.use(
        cors()
    );
}
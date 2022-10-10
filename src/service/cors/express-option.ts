import cors from 'cors';
import { Express } from 'express';

export function corsExpressOption(option: cors.CorsOptions) {
    return (app: Express) => {
        app.use(
            cors(option)
        );
    }
}
import cors from 'cors';
import { Express } from 'express';

export function buildCorsExpressOption(option: cors.CorsOptions) {
    return (app: Express) => {
        app.use(
            cors(option)
        );
    }
}
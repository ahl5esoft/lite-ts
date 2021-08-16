import { json } from 'body-parser';
import { Express } from 'express';

export function bodyParserExpressOption(app: Express) {
    app.use(
        json()
    );
}
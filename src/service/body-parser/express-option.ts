import { json, OptionsJson } from 'body-parser';
import { Express } from 'express';

export function buildBodyParserJsonExpressOption(option: OptionsJson) {
    return (app: Express) => {
        app.use(
            json(option)
        );
    };
}
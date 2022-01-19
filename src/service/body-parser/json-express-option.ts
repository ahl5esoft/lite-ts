import { json, OptionsJson } from 'body-parser';
import { Express } from 'express';

/**
 * 创建body-parser组件选项
 * 
 * @param option json选项
 */
export function buildBodyParserJsonExpressOption(option: OptionsJson) {
    return (app: Express) => {
        app.use(
            json(option)
        );
    };
}
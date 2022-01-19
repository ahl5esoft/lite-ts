import { OptionsUrlencoded, urlencoded } from 'body-parser';
import { Express } from 'express';

/**
 * 创建body-parser form选项
 * 
 * @param option form表单选项
 */
export function buildBodyParserFormExpressOption(option: OptionsUrlencoded) {
    return (app: Express) => {
        app.use(
            urlencoded(option)
        );
    };
}
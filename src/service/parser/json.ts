import { IParser } from '../..';

/**
 * json字符串解析
 */
export class JsonParser implements IParser {
    /**
     * 解析
     * 
     * @param text json文本
     */
    public async parse(text: string) {
        try {
            return JSON.parse(text);
        } catch (ex) {
            return {
                err: ex.message
            };
        }
    }
}
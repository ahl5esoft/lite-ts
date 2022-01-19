import { IParser } from '../..';

/**
 * json解析器
 */
export class JsonParser implements IParser {
    /**
     * 解析
     * 
     * @param text json字符串
     * 
     * @returns json对象
     */
    public async parse(text: string) {
        return JSON.parse(text);
    }
}
import { IParser } from '../..';

/**
 * 数字解析器
 */
export class NumberParser implements IParser {
    /**
     * 解析数字
     * 
     * @param text 文本
     */
    public async parse(text: string) {
        return Number(text);
    }
}
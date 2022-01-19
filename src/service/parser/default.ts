import { IParser } from '../..';

/**
 * 默认解析器
 */
export class DefaultParser implements IParser {
    /**
     * 解析(直接返回原始字符串)
     * 
     * @param text 文本
     */
    public async parse(text: string) {
        return text;
    }
}
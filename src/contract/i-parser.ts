/**
 * 解析器接口
 */
export interface IParser {
    /**
     * 解析文本
     * 
     * @param text 文本
     */
    parse(text: string): Promise<any>;
}
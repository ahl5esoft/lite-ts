import { IParser } from './i-parser';

/**
 * 解析器工厂
 */
export abstract class ParserFactoryBase {
    /**
     * 创建解析器对象
     * 
     * @param type 解析器类型
     */
    public abstract build(type: string): IParser;
}
/**
 * 字符串生成器
 */
export abstract class StringGeneratorBase {
    /**
     * 生成
     */
    public abstract generate(): Promise<string>;
}

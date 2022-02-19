/**
 * 表查询接口
 */
export interface IDbQuery<T> {
    /**
     * 查询数量
     */
    count(): Promise<number>;

    /**
     * 设置正序
     * 
     * @param fields 字段
     */
    order(...fields: string[]): this;

    /**
     * 设置倒序
     * 
     * @param fields 字段
     */
    orderByDesc(...fields: string[]): this;

    /**
     * 设置跳过行数
     * 
     * @param value 数量
     */
    skip(value: number): this;

    /**
     * 设置查询结果数量
     * 
     * @param value 数量
     */
    take(value: number): this;

    /**
     * 查询结果
     */
    toArray(): Promise<T[]>;

    /**
     * 设置查询条件
     * 
     * @param selector 条件
     */
    where(selector: any): this;
}

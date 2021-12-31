/**
 * 数值条件结构
 */
export interface IValueConditionData {
    /**
     * 数量
     */
    count: number;

    /**
     * 运算符, >\>=\=\<\<=
     */
    op: string;

    /**
     * 数值对象
     */
    valueType: number;
}
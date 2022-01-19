import { IValueData } from './i-value-data';

/**
 * 数值条件结构
 */
export interface IValueConditionData extends IValueData {
    /**
     * 运算符, >\>=\=\<\<=
     */
    op: string;
}
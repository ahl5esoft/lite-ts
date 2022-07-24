import { IValue } from './i-value';

/**
 * 数值条件结构
 */
export interface IValueCondition extends IValue {
    /**
     * 运算符
     */
    op: string;
}
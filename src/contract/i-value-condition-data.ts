import { IValueData } from './i-value-data';
import { enum_ } from '../model';

/**
 * 数值条件结构
 */
export interface IValueConditionData extends IValueData {
    /**
     * 运算符
     */
    op: enum_.RelationOperator;
}
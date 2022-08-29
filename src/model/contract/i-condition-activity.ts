import { IValueCondition } from './i-value-condition';

/**
 * 条件活动
 */
export interface IConditionActivity {
    /**
     * 对照数值类型
     */
    readonly contrastValueType: number;
    /**
     * 关闭条件
     */
    readonly closeConditions: IValueCondition[][];
    /**
     * 隐藏条件
     */
    readonly hideConditions: IValueCondition[][];
    /**
     * 开启条件
     */
    readonly openConditions: IValueCondition[][];
}
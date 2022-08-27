import { IValueCondition } from './i-value-condition';

/**
 * 条件活动
 */
export interface IConditionActivity {
    /**
     * 对照数值类型
     */
    contrastValueType: number;
    /**
     * 关闭条件
     */
    closeConditions: IValueCondition[][];
    /**
     * 隐藏条件
     */
    hideConditions: IValueCondition[][];
    /**
     * 开启条件
     */
    openConditions: IValueCondition[][];
}
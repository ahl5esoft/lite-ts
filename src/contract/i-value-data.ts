/**
 * 数值结构
 */
export interface IValueData {
    /**
     * 数量
     */
    count: number;
    /**
     * 数值类型
     */
    valueType: number;
    /**
     * 来源
     */
    source?: string;
    /**
     * 目标类型
     */
    targetType?: number;
    /**
     * 目标值
     */
    targetValue?: number;
}
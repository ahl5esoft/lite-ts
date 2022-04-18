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
     * 目标编号
     */
    targetNo?: number;
    /**
     * 目标类型
     */
    targetType?: number;
}
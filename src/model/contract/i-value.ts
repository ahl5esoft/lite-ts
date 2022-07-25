/**
 * 数值结构
 */
export interface IValue {
    /**
     * 数量
     */
    count: number;
    /**
     * 数值类型
     */
    valueType: number;
    /**
     * 是否跳过拦截
     */
    isSkipIntercept?: boolean;
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
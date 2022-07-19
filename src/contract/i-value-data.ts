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
     * 是否跳过拦截
     */
    isSkipIntercept?: boolean;
    /**
     * 来源
     */
    source?: string;
}
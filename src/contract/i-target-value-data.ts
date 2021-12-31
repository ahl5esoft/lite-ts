/**
 * 目标数值结构
 */
export interface ITargetValueData {
    /**
     * 标识
     */
    id: string;

    /**
     * 已有数值
     */
    values: { [valueType: number]: number };
}
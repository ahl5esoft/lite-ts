/**
 * 目标数值日志结构
 */
export interface ITargetValueLogData {
    /**
     * 新数量
     */
    count: number;

    /**
     * 标识
     */
    id: string;

    /**
     * 旧数量
     */
    oldCount: number;

    /**
     * 数值类型
     */
    valueType: number;
}
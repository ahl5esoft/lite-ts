import { IValueData } from '.';

/**
 * 目标数值日志结构
 */
export interface ITargetValueLogData extends IValueData {
    /**
     * 标识
     */
    id: string;
    /**
     * 旧数量
     */
    oldCount: number;
    /**
     * 来源
     */
    source: string;
}
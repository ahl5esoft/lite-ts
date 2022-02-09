import { IValueData } from '.';

/**
 * 目标数值更新对象
 */
export interface ITargetValueChangeData extends IValueData {
    /**
     * 标识
     */
    id: string;
    /**
     * 来源
     */
    source: string;
}
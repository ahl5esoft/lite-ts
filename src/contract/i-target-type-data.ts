import { IEnumItemData } from './i-enum-item-data';

/**
 * 目标类型枚举模型接口
 */
export interface ITargetTypeData extends IEnumItemData {
    /**
     * 应用
     */
    app: string;
}
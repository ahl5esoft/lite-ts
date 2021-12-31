import { IValueData } from '.';

/**
 * 奖励结构
 */
export interface IRewardData extends IValueData {
    /**
     * 权重
     */
    weight: number;
}
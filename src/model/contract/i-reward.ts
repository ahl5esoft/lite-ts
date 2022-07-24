import { IValue } from './i-value';

/**
 * 奖励接口
 */
export interface IReward extends IValue {
    /**
     * 权重
     */
    weight?: number;
}
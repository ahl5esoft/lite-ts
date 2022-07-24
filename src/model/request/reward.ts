import { IsNumber, IsOptional, Min } from 'class-validator';

import { IReward } from '../contract';

/**
 * 奖励
 */
export class Reward implements IReward {
    /**
     * 数量
     */
    @Min(1)
    public count: number;

    /**
     * 数值类型
     */
    @IsNumber()
    public valueType: number;

    /**
     * 权重
     */
    @IsOptional()
    @Min(0)
    public weight: number;
}
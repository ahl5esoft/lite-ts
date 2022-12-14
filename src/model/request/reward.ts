import { IsOptional, IsPositive, Min } from 'class-validator';

import { IReward } from '../contract';

export class Reward implements IReward {
    @Min(0)
    public count: number;

    @IsPositive()
    public valueType: number;

    @IsOptional()
    @Min(0)
    public weight: number;
}
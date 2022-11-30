import { IsNumber, IsOptional, Min } from 'class-validator';

import { IReward } from '../contract';

export class Reward implements IReward {
    @Min(1)
    public count: number;

    @IsNumber()
    public valueType: number;

    @IsOptional()
    @Min(0)
    public weight: number;
}
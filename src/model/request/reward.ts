import { IsOptional, IsPositive, Min } from 'class-validator';

import { IReward } from '../contract';
import { Integer } from '../../contract';

export class Reward implements IReward {
    @Min(0)
    public count: Integer;

    @IsPositive()
    public valueType: number;

    @IsOptional()
    @Min(0)
    public weight: number;
}
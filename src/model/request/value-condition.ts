import { IsNumber, IsPositive, Max, Min } from 'class-validator';

import { IValueCondition } from '../contract';
import { RelationOperator } from '../enum';

export class ValueCondition implements IValueCondition {
    @IsNumber()
    @Min(1)
    public count: number;

    @Max(16)
    @Min(1)
    public op: RelationOperator;

    @IsPositive()
    public valueType: number;
}
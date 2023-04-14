import { IsNumber, IsPositive, Max, Min } from 'class-validator';

import { IValueCondition } from '../contract';
import { RelationOperator } from '../enum';
import { Integer } from '../../contract';

export class ValueCondition implements IValueCondition {
    @IsNumber()
    @Min(1)
    public count: Integer;

    @Max(16)
    @Min(1)
    public op: RelationOperator;

    @IsPositive()
    public valueType: number;
}
import { IsEnum, IsNumber, Min } from 'class-validator';

import { RelationOperator } from '../enum';
import { IValueConditionData } from '../..';

/**
 * 数值条件
 */
export class ValueCondition implements IValueConditionData {
    /**
     * 数量
     */
    @IsNumber()
    @Min(1)
    public count: number;

    /**
     * 运算符
     */
    @IsEnum(RelationOperator)
    public op: RelationOperator;

    /**
     * 数值类型
     */
    @IsNumber()
    public valueType: number;
}
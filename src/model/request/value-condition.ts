import { IsNumber, Max, Min } from 'class-validator';

import { IValueCondition } from '../contract';
import { RelationOperator } from '../enum';

/**
 * 数值条件
 */
export class ValueCondition implements IValueCondition {
    /**
     * 数量
     */
    @IsNumber()
    @Min(1)
    public count: number;

    /**
     * 运算符
     */
    @Max(16)
    @Min(1)
    public op: RelationOperator;

    /**
     * 数值类型
     */
    @IsNumber()
    public valueType: number;
}
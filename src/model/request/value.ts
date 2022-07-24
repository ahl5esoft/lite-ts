import { IsNumber, IsOptional } from 'class-validator';

import { IValue } from '../contract';

/**
 * 数值请求模型
 */
export class Value implements IValue {
    /**
     * 数量
     */
    @IsNumber()
    public count: number;

    /**
     * 数值类型
     */
    @IsNumber()
    public valueType: number;

    /**
         * 来源
         */
    public source?: string;

    /**
     * 目标编号
     */
    @IsNumber()
    @IsOptional()
    public targetNo?: number;

    /**
     * 目标类型
     */
    @IsNumber()
    @IsOptional()
    public targetType?: number;
}
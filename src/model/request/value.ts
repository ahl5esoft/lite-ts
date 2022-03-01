import { IsNumber, IsOptional } from 'class-validator';

import { IValueData } from '../..';


/**
 * 数值请求模型
 */
export class Value implements IValueData {
    /**
     * 数量
     */
    @IsNumber()
    public count: number;

    /**
     * 来源
     */
    public source: string;

    /**
     * 目标类型
     */
    @IsNumber()
    @IsOptional()
    public targetType: number;

    /**
     * 目标值
     */
    @IsNumber()
    @IsOptional()
    public targetValue: number;

    /**
     * 数值类型
     */
    @IsNumber()
    public valueType: number;
}
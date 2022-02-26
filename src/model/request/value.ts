import { IsNumber } from 'class-validator';

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
     * 数值类型
     */
    @IsNumber()
    public valueType: number;
}
import { IsNumber, IsOptional, Max } from 'class-validator';

import { IValue } from '../contract';

export class Value implements IValue {
    @IsNumber()
    public count: number;

    @IsNumber()
    public valueType: number;

    @IsOptional()
    @Max(32)
    public source?: string;

    @IsNumber()
    @IsOptional()
    public targetNo?: number;

    @IsNumber()
    @IsOptional()
    public targetType?: number;
}
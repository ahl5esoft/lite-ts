import { IsNumber, IsOptional, IsPositive, Length } from 'class-validator';

import { IValue } from '../contract';

export class Value implements IValue {
    @IsNumber()
    public count: number;

    @IsPositive()
    public valueType: number;

    @IsOptional()
    @Length(1, 32)
    public source?: string;

    @IsNumber()
    @IsOptional()
    public targetNo?: number;

    @IsNumber()
    @IsOptional()
    public targetType?: number;
}
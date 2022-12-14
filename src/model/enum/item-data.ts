import { IsInt, IsOptional, Length } from 'class-validator';

export class ItemData {
    @IsInt()
    public value: number;

    @IsOptional()
    @Length(1, 64)
    public key?: string;

    @IsOptional()
    @Length(1, 64)
    public text?: string;
}
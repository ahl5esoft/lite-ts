import { IsNumber, Length, Max, Min } from 'class-validator';

export class Reward {
    @IsNumber()
    public count: number;

    @Length(1, 64)
    public route: string;

    @Max(4096)
    @Min(0)
    public targetIndex: number;

    @Max(64)
    @Min(0)
    public targetType: number;

    @Max(65535)
    @Min(0)
    public valueType: number;
}
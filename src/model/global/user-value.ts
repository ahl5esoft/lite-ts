import { ArrayMinSize, Length, ValidateNested } from 'class-validator';

export class UserValue {
    @Length(20, 32)
    public id: string;

    @ArrayMinSize(1)
    @ValidateNested()
    public values: { [valueType: number]: number };
}
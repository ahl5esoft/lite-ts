import { ArrayMinSize, Length } from 'class-validator';

export class User {
    @Length(20, 32)
    public id: string;

    @ArrayMinSize(1)
    public value: { [valueType: number]: number };

    public randSeed: { [scene: string]: string };
}
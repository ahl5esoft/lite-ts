import { ArrayMinSize, Length, ValidateNested } from 'class-validator';

import { Value } from './value';

/**
 * 用户数值
 */
export class UserValue {
    /**
     * 用户ID
     */
    @Length(20, 32)
    public userID: string;

    /**
     * 数值数据
     */
    @ArrayMinSize(1)
    @ValidateNested()
    public values: Value[];
}
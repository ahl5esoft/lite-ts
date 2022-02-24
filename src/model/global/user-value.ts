import { ITargetValueData } from '../..';

/**
 * 用户数值
 */
export class UserValue implements ITargetValueData {
    /**
     * 用户ID
     */
    public id: string;
    /**
     * 数值数据
     */
    public values: { [valueType: number]: number };
}
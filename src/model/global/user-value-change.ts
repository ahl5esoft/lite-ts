import { IValue } from '../contract';
import { Integer } from '../../contract';

/**
 * 用户数值变更模型
 */
export class UserValueChange implements IValue {
    /**
     * 数量
     */
    public count: Integer;

    public id: string;
    /**
     * 来源
     */
    public source: string;
    /**
     * 用户ID
     */
    public userID: string;
    /**
     * 数值类型
     */
    public valueType: number;
    /**
     * 目标编号
     */
    public targetNo?: number;
    /**
     * 目标类型
     */
    public targetType?: number;
}
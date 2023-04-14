import { Integer } from '../../contract';

/**
 * 用户数值变更日志
 */
export class UserValueLog {
    /**
     * 当前数量
     */
    public count: Integer;
    public id: string;
    /**
     * 旧数量
     */
    public oldCount: Integer;
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
}
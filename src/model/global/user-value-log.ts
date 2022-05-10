/**
 * 用户数值变更日志
 */
export class UserValueLog {
    /**
     * 当前数量
     */
    public count: number;
    public id: string;
    /**
     * 旧数量
     */
    public oldCount: number;
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
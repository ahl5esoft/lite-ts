/**
 * 用户数值模型
 */
export class UserValue {
    /**
     * 用户ID
     */
    public id: string;
    /**
     * 数值数据
     */
    public values: { [valueType: number]: number };
}
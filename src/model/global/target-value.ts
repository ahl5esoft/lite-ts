/**
 * 目标数值模型
 */
export class TargetValue {
    /**
     * 用户ID
     */
    public id: string;
    /**
     * 数值数据
     */
    public values: { [valueType: number]: number };
}
/**
 * 区间活动
 */
export interface IRangeActivity {
    /**
     * 关闭时间
     */
    readonly closeOn: number;
    /**
     * 隐藏时间
     */
    readonly hideOn: number;
    /**
     * 开启时间
     */
    readonly openOn: number;
}
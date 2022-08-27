/**
 * 区间活动
 */
export interface IRangeActivity {
    /**
     * 关闭时间
     */
    closeOn: number;
    /**
     * 隐藏时间
     */
    hideOn: number;
    /**
     * 开启时间
     */
    openOn: number;
}
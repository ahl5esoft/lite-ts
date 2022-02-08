/**
 * 运算符
 */
export enum RelationOperator {
    /**
     * 等于
     */
    eq = '=',
    /**
     * 与当前时间差(等于)
     */
    eqNowDiff = '=now-diff',
    /**
     * 大于等于
     */
    ge = '>=',
    /**
     * 与当前时间差(大于等于)
     */
    geNowDiff = '>=now-diff',
    /**
     * 大于
     */
    gt = '>',
    /**
     * 与当前时间差(大于)
     */
    gtNowDiff = '>now-diff',
    /**
     * 小于
     */
    le = '<=',
    /**
     * 与当前时间差(小于等于)
     */
    leNowDiff = '<=now-diff',
    /**
     * 小于
     */
    lt = '<',
    /**
     * 与当前时间差(小于)
     */
    ltNowDiff = '<now-diff',
}
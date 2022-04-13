/**
 * 可追踪接口
 */
export interface ITraceable<T> {
    /**
     * 包装跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    withTrace(parentSpan: any): T;
}
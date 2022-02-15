/**
 * 可追踪接口
 */
export interface ITraceable {
    /**
     * 
     */
    withTrace(parentSpan: any): any;
}
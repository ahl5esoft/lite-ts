import { ITraceable } from '../../contract';

/**
 * 跟踪策略
 */
export class TracerStrategy<T> implements ITraceable<T> {
    /**
     * 构造函数
     * 
     * @param m_Origin 原对象
     */
    public constructor(
        private m_Origin: T
    ) { }

    /**
     * 包装跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        const tracer = this.m_Origin as any as ITraceable<T>;
        return tracer?.withTrace && parentSpan ? tracer.withTrace(parentSpan) : this.m_Origin;
    }
}
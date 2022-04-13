import { opentracing } from 'jaeger-client';

import { MultiUnitOfWork } from './multi-unit-of-work';
import { TracerStrategy } from '../tracer';
import { DbFactoryBase, ITraceable } from '../../contract';

/**
 * 多数据库工厂
 */
export class MultiDbFactory extends DbFactoryBase implements ITraceable<DbFactoryBase> {
    /**
     * 
     * @param m_DbFactories 构造函数
     * @param m_ParentSpan 父跟踪范围
     */
    public constructor(
        private m_DbFactories: { [dbType: string]: DbFactoryBase },
        private m_ParentSpan?: opentracing.Span
    ) {
        super();
    }

    /**
     * 创建数据库仓储
     * 
     * @param model 模型
     * @param extra 扩展参数, 如: 工作单元, model.enum_.DbType
     */
    public db<T>(model: new () => T, ...extra: any[]) {
        let uow: MultiUnitOfWork;
        let dbType: string;
        for (const r of extra) {
            if (r instanceof MultiUnitOfWork)
                uow = r;
            else if (typeof r == 'string')
                dbType = r;
        }

        if (!this.m_DbFactories[dbType])
            throw new Error(`无效数据库类型: ${dbType}`);

        return new TracerStrategy(this.m_DbFactories[dbType]).withTrace(this.m_ParentSpan).db(model, uow?.uows[dbType]);
    }

    /**
     * 创建工作单元
     */
    public uow() {
        const uows = Object.keys(this.m_DbFactories).reduce((memo, r) => {
            memo[r] = new TracerStrategy(
                this.m_DbFactories[r].uow()
            ).withTrace(this.m_ParentSpan);
            return memo;
        }, {});
        return new MultiUnitOfWork(uows);
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        return new MultiDbFactory(this.m_DbFactories, parentSpan);
    }
}
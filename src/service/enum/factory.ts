import { opentracing } from 'jaeger-client';
import { EnumFacatoryBase, IEnumItemData, ITraceable } from '../..';

/**
 * 枚举工厂
 */
export class EnumFactory extends EnumFacatoryBase implements ITraceable {
    /**
     * 构造函数
     * 
     * @param m_BuildFuncs 创建枚举函数数组
     * @param m_ParentSpan 父跟踪范围
     */
    public constructor(
        private m_BuildFuncs: { [key: string]: () => any },
        private m_ParentSpan?: opentracing.Span,
    ) {
        super();
    }

    /**
     * 创建枚举
     * 
     * @param model 枚举模型
     */
    public build<T extends IEnumItemData>(model: new () => T) {
        if (model.name in this.m_BuildFuncs) {
            let enumObj = this.m_BuildFuncs[model.name]();
            const enumTracer = enumObj as ITraceable;
            if (enumTracer.withTrace)
                enumObj = enumTracer.withTrace(this.m_ParentSpan);
            return enumObj;
        }

        throw new Error(`缺少创建函数: ${model.name}`);
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父跟踪范围
     */
    public withTrace(parentSpan: any) {
        return new EnumFactory(this.m_BuildFuncs, parentSpan);
    }
}
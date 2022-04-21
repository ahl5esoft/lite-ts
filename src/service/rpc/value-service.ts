import { TargetValueServiceBase } from '../target';
import { TracerStrategy } from '../tracer';
import {
    EnumFactoryBase,
    ITraceable,
    IUnitOfWork,
    IValueData,
    NowTimeBase,
    RpcBase
} from '../../contract';
import { global } from '../../model';

/**
 * 用户其他数值服务
 */
export class RpcValueService<T extends global.TargetValue> extends TargetValueServiceBase<T> implements ITraceable<TargetValueServiceBase<T>> {
    /**
     * 实体
     */
    public get entry() {
        return Promise.resolve(this.m_Entry);
    }

    /**
     * 构造函数
     * 
     * @param m_Entry 实体
     * @param m_Rpc 远程过程调用
     * @param m_UserID 用户ID
     * @param enumFactory 数值枚举
     * @param nowTime 当前时间
     */
    public constructor(
        private m_Entry: T,
        private m_Rpc: RpcBase,
        private m_UserID: string,
        enumFactory: EnumFactoryBase,
        nowTime: NowTimeBase,
    ) {
        super(enumFactory, nowTime);
    }

    /**
     * 更新
     * 
     * @param _ 工作单元(忽略)
     * @param values 数值数组
     */
    public async update(_: IUnitOfWork, values: IValueData[]) {
        await this.m_Rpc.setBody({
            userID: this.m_UserID,
            values: values
        }).call<void>('/prop/ih/update-values-by-user-id');
    }

    /**
     * 包装跟踪
     * 
     * @param parentSpan 父范围跟踪
     */
    public withTrace(parentSpan: any) {
        return new RpcValueService<T>(
            this.m_Entry,
            new TracerStrategy(this.m_Rpc).withTrace(parentSpan),
            this.m_UserID,
            new TracerStrategy(this.enumFactory).withTrace(parentSpan),
            this.nowTime
        );
    }
}
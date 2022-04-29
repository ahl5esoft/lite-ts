import { TargetValueServiceBase } from '../target';
import {
    EnumFactoryBase,
    IUnitOfWork,
    IValueData,
    NowTimeBase,
    RpcBase
} from '../../contract';
import { enum_, global } from '../../model';

/**
 * 用户其他数值服务
 */
export class RpcValueService<T extends global.TargetValue> extends TargetValueServiceBase<T>{
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
     * @param m_TargetTypeData 目标类型数据
     * @param m_Rpc 远程过程调用
     * @param enumFactory 数值枚举
     * @param nowTime 当前时间
     */
    public constructor(
        private m_Entry: T,
        private m_TargetTypeData: enum_.TargetTypeData,
        private m_Rpc: RpcBase,
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
            ...this.m_Entry,
            values: values
        }).call<void>(`/${this.m_TargetTypeData.app}/ih/update-values-by-user-id`);
    }
}
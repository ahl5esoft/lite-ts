import { TargetValueServiceBase } from '../target';
import {
    EnumFactoryBase,
    IUnitOfWork,
    IUserAssociateService,
    IValueData,
    NowTimeBase,
    RpcBase
} from '../../contract';
import { enum_, global } from '../../model';

/**
 * 用户其他数值服务
 */
export class RpcValueService<T extends global.UserTargetValue> extends TargetValueServiceBase<T>{
    /**
     * 实体
     */
    public get entry() {
        return new Promise<T>(async (s, f) => {
            try {
                const entries = await this.m_AssociateService.find<T>(`user-target-value-${this.m_TargetTypeData.value}`, r => {
                    return r.no == this.m_DefaultEntry.no;
                });
                s(entries[0]);
            } catch (ex) {
                f(ex);
            }
        });
    }

    /**
     * 构造函数
     * 
     * @param m_AssociateService 关联服务
     * @param m_TargetTypeData 目标类型数据
     * @param m_Rpc 远程过程调用
     * @param enumFactory 数值枚举
     * @param nowTime 当前时间
     */
    public constructor(
        private m_AssociateService: IUserAssociateService,
        private m_Rpc: RpcBase,
        private m_TargetTypeData: enum_.TargetTypeData,
        private m_DefaultEntry: T,
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
        const entry = await this.entry;
        await this.m_Rpc.setBody({
            ...(entry ?? this.m_DefaultEntry),
            values: values
        }).call<void>(`/${this.m_TargetTypeData.app}/ih/update-values-by-user-id`);
    }
}
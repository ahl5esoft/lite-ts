import {
    EnumFactoryBase,
    IUnitOfWork,
    RpcBase,
    UserServiceBase,
    ValueServiceBase
} from '../../contract';
import { contract, enum_, global } from '../../model';

/**
 * 用户其他数值服务
 */
export class RpcValueService<T extends global.UserTargetValue> extends ValueServiceBase<T>{
    /**
     * 实体
     */
    public get entry() {
        return new Promise<T>(async (s, f) => {
            try {
                const entries = await this.m_UserService.associateService.find<T>(this.m_TargetTypeData.key);
                s(
                    entries.length == 1 ? entries[0] : entries.find(r => r.no == this.m_Entry.no)
                );
            } catch (ex) {
                f(ex);
            }
        });
    }

    /**
     * 当前时间
     */
    public get now() {
        return this.m_UserService.valueService.now;
    }

    /**
     * 构造函数
     * 
     * @param m_Rpc 远程过程调用
     * @param m_UserService 用户数值服务
     * @param m_TargetTypeData 目标类型数据
     * @param m_Entry 实体
     * @param enumFactory 数值枚举
     */
    public constructor(
        private m_Rpc: RpcBase,
        private m_UserService: UserServiceBase,
        private m_TargetTypeData: enum_.TargetTypeData,
        private m_Entry: T,
        enumFactory: EnumFactoryBase,
    ) {
        super(enumFactory);
    }

    /**
     * 更新
     * 
     * @param _ 工作单元(忽略)
     * @param values 数值数组
     */
    public async update(_: IUnitOfWork, values: contract.IValue[]) {
        await this.m_Rpc.setBody({
            ...this.m_Entry,
            values: values
        }).call<void>(`/${this.m_TargetTypeData.app}/update-values-by-user-id`);
    }
}
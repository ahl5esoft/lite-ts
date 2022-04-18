import { CustomError } from '../error';
import { TargetValueServiceBase } from '../target';
import {
    EnumFactoryBase,
    IUnitOfWork,
    IValueData,
    NowTimeBase,
    RpcBase
} from '../../contract';
import { global } from '../../model';

/**
 * 用户其他数值服务
 */
export class RpcValueService<T extends global.TargetValue> extends TargetValueServiceBase<T> {
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
        const resp = await this.m_Rpc.setBody({
            userID: this.m_UserID,
            values: values
        }).call<void>('/prop/ih/update-values-by-user-id');
        if (resp.err)
            throw new CustomError(resp.err, resp.data);
    }
}
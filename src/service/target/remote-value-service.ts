import { TargetValueServiceBase } from './value-service-base';
import { CustomError } from '../error';
import {
    IEnum,
    ITargetValueData,
    IUnitOfWork,
    IValueData,
    IValueTypeData,
    model,
    NowTimeBase,
    RpcBase
} from '../..';

/**
 * 用户其他数值服务
 */
export class TargetRemoteValueService extends TargetValueServiceBase<ITargetValueData, IValueTypeData> {
    /**
     * 实体数据
     */
    public get entry() {
        return Promise.resolve(this.m_Entry);
    }

    /**
     * 构造函数
     * 
     * @param m_Entry 实体数据
     * @param m_Rpc 远程过程调用
     * @param m_TargetTypeData 目标类型数据
     * @param m_userID 用户ID
     * @param valueTypeEnum 数值枚举
     * @param nowTime 当前时间
     */
    public constructor(
        private m_Entry: ITargetValueData,
        private m_Rpc: RpcBase,
        private m_TargetTypeData: model.enum_.TargetTypeData,
        private m_userID: string,
        valueTypeEnum: IEnum<IValueTypeData>,
        nowTime: NowTimeBase,
    ) {
        super(valueTypeEnum, nowTime);
    }

    /**
     * 更新
     * 
     * @param _ 工作单元(忽略)
     * @param values 数值数组
     */
    public async update(_: IUnitOfWork, values: IValueData[]) {
        const resp = await this.m_Rpc.setBody({
            userID: this.m_userID,
            values: values
        }).call(`/${this.m_TargetTypeData.app}/ih/update-values-by-user-id`);
        if (resp.err)
            throw new CustomError(resp.err, resp.data);
    }
}
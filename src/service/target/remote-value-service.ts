import { TargetValueServiceBase } from './value-service-base';
import { CustomError } from '../error';
import {
    IEnum,
    ITargetValueData,
    IUnitOfWork,
    IValueData,
    NowTimeBase,
    RpcBase
} from '../..';
import { enum_ } from '../../model';

/**
 * 用户其他数值服务
 */
export class TargetRemoteValueService extends TargetValueServiceBase<ITargetValueData> {
    /**
     * 实体数据
     */
    public get entry() {
        return new Promise<ITargetValueData>(async (s, f) => {
            if (!this.m_Entry) {
                try {
                    const resp = await this.m_Rpc.setBody({
                        userID: this.m_userID
                    }).call(`${this.m_TargetTypeData.app}/ih/find-values-by-user-id`);
                    if (resp.err)
                        throw new CustomError(resp.err, resp.data);

                    this.m_Entry = resp.data[0];
                } catch (ex) {
                    return f(ex);
                }
            }

            s(this.m_Entry);
        });
    }

    /**
     * 构造函数
     * 
     * @param m_Rpc 远程过程调用
     * @param m_TargetTypeData 目标类型数据
     * @param m_userID 用户ID
     * @param valueTypeEnum 数值枚举
     * @param nowTime 当前时间
     * @param m_Entry 实体数据
     */
    public constructor(
        private m_Rpc: RpcBase,
        private m_TargetTypeData: enum_.TargetTypeData,
        private m_userID: string,
        valueTypeEnum: IEnum<enum_.ValueTypeData>,
        nowTime: NowTimeBase,
        private m_Entry?: ITargetValueData,
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
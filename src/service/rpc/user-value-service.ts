import { TargetValueServiceBase } from '../target';
import {
    EnumFactoryBase,
    IRewardData,
    IUnitOfWork,
    IUserAssociateService,
    IUserService,
    IUserValueService,
    IValueData,
    NowTimeBase,
    RpcBase
} from '../../contract';
import { global } from '../../model';

/**
 * 用户数值服务(远程)
 */
export class RpcUserValueService extends TargetValueServiceBase<global.UserValue> implements IUserValueService {
    /**
     * 用户服务
     */
    public userService: IUserService;

    /**
     * 实体
     */
    public get entry() {
        return new Promise<global.UserValue>(async (s, f) => {
            try {
                const entries = await this.m_AssociateService.find<global.UserValue>(global.UserValue.name, r => {
                    return r.id == this.m_UserID
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
     * @param m_Rpc 远程过程调用
     * @param m_NowValueType 当前时间数值类型
     * @param m_UserID 用户ID
     * @param enumFactory 枚举工厂
     * @param nowTime 当前时间
     */
    public constructor(
        private m_AssociateService: IUserAssociateService,
        private m_Rpc: RpcBase,
        private m_NowValueType: number,
        private m_UserID: string,
        enumFactory: EnumFactoryBase,
        nowTime: NowTimeBase,
    ) {
        super(
            enumFactory,
            nowTime,
        );
    }

    /**
     * 获取当前unix
     * 
     * @param uow 工作单元
     */
    public async getNow(uow: IUnitOfWork) {
        let now = await this.getCount(uow, this.m_NowValueType);
        if (!now)
            now = await this.nowTime.unix();

        return now;
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
     * 根据奖励更新数值
     * 
     * @param _ 工作单元
     * @param source 来源
     * @param rewards 奖励
     */
    public async updateByRewards(_: IUnitOfWork, source: string, rewards: IRewardData[][]) {
        const resp = await this.m_Rpc.setBody({
            rewards,
            source: source,
            userID: this.m_UserID,
        }).call<IValueData[]>('/prop/ih/update-user-value-by-rewards');
        return resp.data;
    }
}
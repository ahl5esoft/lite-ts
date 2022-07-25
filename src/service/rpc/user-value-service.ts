import { TargetValueServiceBase } from '../target';
import {
    EnumFactoryBase,
    IUnitOfWork,
    IUserValueService,
    NowTimeBase,
    RpcBase,
    UserServiceBase,
} from '../../contract';
import { contract, enum_, global } from '../../model';

/**
 * 用户数值服务(远程)
 */
export class RpcUserValueService extends TargetValueServiceBase<global.UserValue> implements IUserValueService {
    /**
     * 更新数值路由
     */
    public static updateRoute = 'update-values-by-user-id';

    /**
     * 实体
     */
    public get entry() {
        return new Promise<global.UserValue>(async (s, f) => {
            try {
                const entries = await this.userService.associateService.find<global.UserValue>(global.UserValue.name, r => {
                    return r.id == this.userService.userID
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
     * @param userService 用户服务
     * @param m_Rpc 远程过程调用
     * @param m_TargetTypeData 目标类型数据
     * @param m_NowValueType 当前时间数值类型
     * @param enumFactory 枚举工厂
     * @param nowTime 当前时间
     */
    public constructor(
        public userService: UserServiceBase,
        private m_Rpc: RpcBase,
        private m_TargetTypeData: enum_.TargetTypeData,
        private m_NowValueType: number,
        enumFactory: EnumFactoryBase,
        nowTime: NowTimeBase,
    ) {
        super(enumFactory, nowTime);
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
    public async update(_: IUnitOfWork, values: contract.IValue[]) {
        await this.m_Rpc.setBody({
            userID: this.userService.userID,
            values: values
        }).call<void>(`/${this.m_TargetTypeData.app}/${RpcUserValueService.updateRoute}`);
    }
}
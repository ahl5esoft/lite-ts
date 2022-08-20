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
     * 变更
     */
    private m_ChangeValue = {};

    /**
     * 实体
     */
    public get entry() {
        return new Promise<global.UserValue>(async (s, f) => {
            try {
                const entries = await this.userService.associateService.find<global.UserValue>(global.UserValue.name, r => {
                    return r.id == this.userService.userID;
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
     * @param uow 工作单元
     * @param values 数值数组
     */
    public async update(uow: IUnitOfWork, values: contract.IValue[]) {
        const route = ['', this.m_TargetTypeData.app, RpcUserValueService.updateRoute].join('/')
        if (uow) {
            for (const r of values) {
                this.m_ChangeValue[r.valueType] ??= 0;
                this.m_ChangeValue[r.valueType] += r.count;
            }
            uow.registerAfter(async () => {
                await this.m_Rpc.setBody({
                    userID: this.userService.userID,
                    values: Object.entries(this.m_ChangeValue).map(([k, v]) => {
                        return {
                            ...values[0],
                            count: v,
                            valueType: parseInt(k),
                        };
                    })
                }).call<void>(route);
            }, route);
        } else {
            await this.m_Rpc.setBody({
                userID: this.userService.userID,
                values: values
            }).call<void>(route);
        }
    }
}
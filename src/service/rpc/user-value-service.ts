import {
    EnumFactoryBase,
    IUnitOfWork,
    NowTimeBase,
    RpcBase,
    UserServiceBase,
    UserValueServiceBase,
} from '../../contract';
import { contract, enum_ } from '../../model';

/**
 * 用户数值服务(远程)
 */
export class RpcUserValueService extends UserValueServiceBase {
    public static updateRoute = 'update-values-by-user-id';

    private m_ChangeValues: contract.IValue[] = [];

    /**
     * 构造函数
     * 
     * @param m_Rpc 远程过程调用
     * @param m_TargetTypeData 目标类型数据
     * @param enumFactory 枚举工厂
     * @param nowTime 当前时间
     * @param userService 用户服务
     * @param nowValueType 当前时间数值类型
     */
    public constructor(
        private m_Rpc: RpcBase,
        private m_TargetTypeData: enum_.TargetTypeData,
        enumFactory: EnumFactoryBase,
        nowTime: NowTimeBase,
        userService: UserServiceBase,
        nowValueType: number,
    ) {
        super(userService, nowTime, nowValueType, enumFactory);
    }

    public async update(uow: IUnitOfWork, values: contract.IValue[]) {
        const route = ['', this.m_TargetTypeData.app, RpcUserValueService.updateRoute].join('/')
        if (uow) {
            this.m_ChangeValues.push(...values);
            uow.registerAfter(async () => {
                await this.m_Rpc.call<void>({
                    body: {
                        userID: this.userService.userID,
                        values: this.m_ChangeValues
                    },
                    route
                });
            }, route);
        } else {
            await this.m_Rpc.call<void>({
                body: {
                    userID: this.userService.userID,
                    values: values
                },
                route
            });
        }
    }
}
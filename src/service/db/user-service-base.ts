import { RpcValueService } from '../rpc';
import {
    DbFactoryBase,
    EnumFactoryBase,
    ITargetValueService,
    IUserAssociateService,
    IUserService,
    IUserValueService,
    NowTimeBase,
    RpcBase,
    StringGeneratorBase,
    ValueInterceptorFactoryBase
} from '../../contract';
import { enum_, global } from '../../model';

/**
 * 用户服务
 */
export abstract class DbUserServiceBase implements IUserService {
    /**
     * 目标数值服务
     */
    private m_TargetValueServices: {
        [targetType: number]: {
            [targetNo: number]: ITargetValueService<global.UserTargetValue>
        };
    } = {};

    /**
     * 用户数值服务
     */
    public abstract get valueService(): IUserValueService;

    /**
     * 
     * @param associateService 关联存储服务
     * @param userID 用户ID
     * @param dbFactory 数据库工厂
     * @param enumFactory 枚举工厂
     * @param nowTime 当前时间
     * @param rpc 远程过程调用
     * @param stringGenerator 字符串生成器
     * @param valueInterceptorFactory 数值拦截器工厂
     */
    public constructor(
        public associateService: IUserAssociateService,
        public userID: string,
        protected dbFactory: DbFactoryBase,
        protected enumFactory: EnumFactoryBase,
        protected nowTime: NowTimeBase,
        protected rpc: RpcBase,
        protected stringGenerator: StringGeneratorBase,
        protected valueInterceptorFactory: ValueInterceptorFactoryBase,
    ) { }

    /**
     * 获取目标数值服务
     * 
     * @param targetNo 目标值
     * @param targetType 目标类型
     */
    public async getTargetValueService(targetNo: number, targetType: number) {
        if (targetType == 0)
            throw new Error('无法获取用户数值服务');

        const targetTypeEnumItem = await this.enumFactory.build(enum_.TargetTypeData).get(r => {
            return r.value == targetType;
        });
        if (!targetTypeEnumItem)
            throw new Error(`无效目标类型: ${targetType}`);

        this.m_TargetValueServices[targetType] ??= {};

        if (!this.m_TargetValueServices[targetType][targetNo])
            this.m_TargetValueServices[targetType][targetNo] = this.createTargetValueService(targetTypeEnumItem.data, targetNo);

        return this.m_TargetValueServices[targetType][targetNo];
    }

    /**
     * 创建目标数值服务
     * 
     * @param targetTypeData 目标类型数据
     * @param targetNo 目标编号
     */
    private createTargetValueService(targetTypeData: enum_.TargetTypeData, targetNo: number) {
        return new RpcValueService(this.associateService, this.rpc, targetTypeData, {
            no: targetNo,
            userID: this.userID,
        } as global.UserTargetValue, this.enumFactory, this.nowTime);
    }
}
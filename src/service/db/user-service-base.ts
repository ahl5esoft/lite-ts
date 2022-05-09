import { CustomError } from '../error';
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
    private m_TargetValueServices: { [targetType: number]: ITargetValueService<global.TargetValue>[]; } = {};

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
        const targetTypeEnumItem = await this.enumFactory.build(enum_.TargetTypeData).get(r => {
            return r.value == targetType;
        });
        if (!targetTypeEnumItem)
            throw new Error(`无效目标类型: ${targetType}`);

        if (!this.m_TargetValueServices[targetType]) {
            const resp = await this.rpc.setBody({
                userID: this.userID
            }).call<global.TargetValue[]>(`/${targetTypeEnumItem.data.app}/ih/find-values-by-user-id`);
            if (resp.err)
                throw new CustomError(resp.err, resp.data);

            this.m_TargetValueServices[targetType] = resp.data.map(r => {
                return this.createTargetValueService(r, targetTypeEnumItem.data);
            });
        }

        for (const r of this.m_TargetValueServices[targetType]) {
            const entry = (await r.entry) as any as { no: number; };
            if (entry.no == targetNo)
                return r;
        }

        throw new Error(`无效目标: ${targetTypeEnumItem.data.app}[${targetNo}]`);
    }

    /**
     * 创建目标数值服务
     * 
     * @param targetEntry 目标实体
     * @param targetTypeData 目标类型数据
     */
    private createTargetValueService(targetEntry: global.TargetValue, targetTypeData: enum_.TargetTypeData) {
        return new RpcValueService(targetEntry, targetTypeData, this.rpc, this.enumFactory, this.nowTime);
    }
}
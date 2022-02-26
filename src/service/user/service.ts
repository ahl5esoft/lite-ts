import { UserValueService } from './value-service';
import { CustomError, TargetRemoteValueService } from '..';
import {
    DbFactoryBase,
    EnumFacatoryBase,
    IAssociateStorageService,
    IEnum,
    ITargetValueData,
    ITargetValueService,
    IUserService,
    IUserValueService,
    IValueTypeData,
    model,
    NowTimeBase,
    RpcBase,
    StringGeneratorBase,
    ValueInterceptorFactoryBase
} from '../..';

/**
 * 用户服务
 */
export class UserService implements IUserService {
    /**
     * 目标数值服务
     */
    private m_TargetValueServices: { [targetType: number]: ITargetValueService[] } = {};

    private m_ValueService: IUserValueService<IUserService>;
    /**
     * 用户数值服务
     */
    public get valueService() {
        if (!this.m_ValueService) {
            this.m_ValueService = new UserValueService(
                this,
                this.valueTypeEnum,
                this.m_DbFactory,
                this.m_NowTime,
                this.m_StringGenerator,
                this.m_ValueInterceptorFactory
            );
        }

        return this.m_ValueService;
    }

    private m_TargetTypeEnum: IEnum<model.enum_.TargetTypeData>;
    /**
     * 目标类型枚举
     */
    protected get targetTypeEnum() {
        if (!this.m_TargetTypeEnum)
            this.m_TargetTypeEnum = this.m_EnumFactory.build(model.enum_.TargetTypeData);

        return this.m_TargetTypeEnum;
    }

    private m_ValueTypeEnum: IEnum<IValueTypeData>;
    /**
     * 数值枚举
     */
    protected get valueTypeEnum() {
        if (!this.m_ValueTypeEnum)
            this.m_ValueTypeEnum = this.m_EnumFactory.build(this.m_ValueTypeModel);

        return this.m_ValueTypeEnum;
    }

    /**
     * 
     * @param associateStorageService 关联存储服务
     * @param userID 用户ID
     * @param m_DbFactory 数据库工厂
     * @param m_EnumFactory 枚举工厂
     * @param m_NowTime 当前时间
     * @param m_Rpc 远程过程调用
     * @param m_StringGenerator 字符串生成器
     * @param m_ValueInterceptorFactory 数值拦截器工厂
     * @param m_ValueTypeModel 数值类型模型
     */
    public constructor(
        public associateStorageService: IAssociateStorageService,
        public userID: string,
        private m_DbFactory: DbFactoryBase,
        private m_EnumFactory: EnumFacatoryBase,
        private m_NowTime: NowTimeBase,
        private m_Rpc: RpcBase,
        private m_StringGenerator: StringGeneratorBase,
        private m_ValueInterceptorFactory: ValueInterceptorFactoryBase,
        private m_ValueTypeModel: new () => IValueTypeData,
    ) { }

    /**
     * 获取目标数值服务
     * 
     * @param targetType 目标类型
     * @param targetValue 目标值
     */
    public async getTargetValueService(targetType: number, targetValue: number) {
        if (!targetType)
            return this.valueService;

        const targetTypeItem = await this.m_TargetTypeEnum.get(r => {
            return r.value == targetValue;
        });
        if (!targetTypeItem)
            throw new Error(`无效目标类型: ${targetType}`);

        if (!this.m_TargetValueServices[targetType]) {
            const resp = await this.m_Rpc.setBody({
                userID: this.userID
            }).call(`/${targetTypeItem.data.app}/ih/find-values-by-user-id`);
            if (resp.err)
                throw new CustomError(resp.err, resp.data);

            this.m_TargetValueServices[targetType] = (resp.data as ITargetValueData[]).map(r => {
                return this.createTargetValueService(targetTypeItem.data, r);
            });
        }

        for (const r of this.m_TargetValueServices[targetType]) {
            const entry = (await r.entry) as any as { no: number };
            if (entry.no == targetValue)
                return r;
        }

        throw new Error(`无效目标: ${targetTypeItem.data.app}[${targetValue}]`);
    }

    /**
     * 创建目标数值服务
     * 
     * @param targetTypeData 目标类型数据
     * @param targetEntry 目标实体 
     */
    private createTargetValueService(targetTypeData: model.enum_.TargetTypeData, targetEntry: ITargetValueData) {
        return new TargetRemoteValueService(targetEntry, this.m_Rpc, targetTypeData, this.userID, this.valueTypeEnum, this.m_NowTime);
    }
}
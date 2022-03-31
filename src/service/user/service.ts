import { UserValueService } from './value-service';
import { CustomError } from '../error';
import { TargetRemoteValueService } from '../target';
import {
    DbFactoryBase,
    IAssociateStorageService,
    IEnum,
    ITargetValueData,
    ITargetValueService,
    IUserService,
    IUserValueService,
    NowTimeBase,
    RpcBase,
    StringGeneratorBase,
    ValueInterceptorFactoryBase
} from '../..';
import { enum_ } from '../../model';

/**
 * 用户服务
 */
export class UserService implements IUserService {
    /**
     * 目标数值服务
     */
    private m_TargetValueServices: { [targetType: number]: ITargetValueService[] } = {};

    private m_ValueService: IUserValueService;
    /**
     * 用户数值服务
     */
    public get valueService() {
        if (!this.m_ValueService) {
            this.m_ValueService = new UserValueService(
                this,
                this.valueTypeEnum,
                this.dbFactory,
                this.nowTime,
                this.stringGenerator,
                this.valueInterceptorFactory
            );
        }

        return this.m_ValueService;
    }

    /**
     * 
     * @param associateStorageService 关联存储服务
     * @param userID 用户ID
     * @param valueTypeEnum 数值类型枚举
     * @param targetTypeEnum 目标类型枚举
     * @param dbFactory 数据库工厂
     * @param nowTime 当前时间
     * @param rpc 远程过程调用
     * @param stringGenerator 字符串生成器
     * @param valueInterceptorFactory 数值拦截器工厂
     */
    public constructor(
        public associateStorageService: IAssociateStorageService,
        public userID: string,
        protected valueTypeEnum: IEnum<enum_.ValueTypeData>,
        protected targetTypeEnum: IEnum<enum_.TargetTypeData>,
        protected dbFactory: DbFactoryBase,
        protected nowTime: NowTimeBase,
        protected rpc: RpcBase,
        protected stringGenerator: StringGeneratorBase,
        protected valueInterceptorFactory: ValueInterceptorFactoryBase,
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

        const targetTypeItem = await this.targetTypeEnum.get(r => {
            return r.value == targetValue;
        });
        if (!targetTypeItem)
            throw new Error(`无效目标类型: ${targetType}`);

        if (!this.m_TargetValueServices[targetType]) {
            const resp = await this.rpc.setBody({
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
    private createTargetValueService(targetTypeData: enum_.TargetTypeData, targetEntry: ITargetValueData) {
        return new TargetRemoteValueService(targetEntry, this.rpc, targetTypeData, this.userID, this.valueTypeEnum, this.nowTime);
    }
}
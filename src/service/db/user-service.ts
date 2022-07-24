import { DbUserValueService } from './user-value-service';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IUserAssociateService,
    IUserValueService,
    NowTimeBase,
    StringGeneratorBase,
    UserServiceBase,
    ValueInterceptorFactoryBase,
} from '../../contract';

/**
 * 用户服务
 */
export class DbUserService extends UserServiceBase {
    private m_ValueService: IUserValueService;
    /**
     * 用户数值服务
     */
    public get valueService() {
        this.m_ValueService ??= new DbUserValueService(
            this,
            this.nowValueType,
            this.dbFactory,
            this.enumFactory,
            this.nowTime,
            this.stringGenerator,
            this.valueInterceptorFactory,
        );
        return this.m_ValueService;
    }

    /**
     * 构造函数
     * 
     * @param dbFactory 数据库工厂
     * @param enumFactory 枚举工厂
     * @param nowTime 当前时间
     * @param stringGenerator 字符串生成器
     * @param valueInterceptorFactory 数值拦截器工厂
     * @param nowValueType 当前时间数值类型
     * @param associateService 关联存储服务
     * @param userID 用户ID
     */
    public constructor(
        protected dbFactory: DbFactoryBase,
        protected enumFactory: EnumFactoryBase,
        protected nowTime: NowTimeBase,
        protected stringGenerator: StringGeneratorBase,
        protected valueInterceptorFactory: ValueInterceptorFactoryBase,
        protected nowValueType: number,
        associateService: IUserAssociateService,
        userID: string,
    ) {
        super(associateService, userID);
    }
}
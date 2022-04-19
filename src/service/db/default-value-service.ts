import { DbValueServiceBase } from './value-service-base';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IUserAssociateService,
    NowTimeBase,
    StringGeneratorBase,
    ValueInterceptorFactoryBase
} from '../../contract';
import { global } from '../../model';

/**
 * 默认数值服务
 */
export class DbDefaultValueService extends DbValueServiceBase<global.TargetValue, global.TargetValueChange, global.TargetValueLog> {
    /**
     * 实体
     */
    public get entry() {
        return new Promise<global.TargetValue>(async (s, f) => {
            try {
                const rows = await this.associateService.find<global.TargetValue>(global.TargetValue.name, r => {
                    return r.id == this.m_UserID;
                });
                s(rows[0]);
            } catch (ex) {
                f(ex);
            }
        });
    }

    /**
     * 构造函数
     * 
     * @param m_UserID 用户ID
     * @param associateService 关联服务
     * @param dbFactory 数据库工厂
     * @param enumFactory 枚举工厂
     * @param nowTime 当前时间
     * @param stringGenerator 字符串生成器
     * @param valueInterceptorFactory 数值拦截器工厂
     * @param targetType 目标类型
     */
    public constructor(
        private m_UserID: string,
        associateService: IUserAssociateService,
        dbFactory: DbFactoryBase,
        enumFactory: EnumFactoryBase,
        nowTime: NowTimeBase,
        stringGenerator: StringGeneratorBase,
        valueInterceptorFactory: ValueInterceptorFactoryBase,
        targetType: number,
    ) {
        super(
            associateService,
            dbFactory,
            stringGenerator,
            valueInterceptorFactory,
            targetType,
            global.TargetValue,
            global.TargetValueChange,
            global.TargetValueLog,
            enumFactory,
            nowTime,
        );
    }

    /**
     * 创建用户数值实体
     */
    protected createEntry() {
        return {
            id: this.m_UserID
        } as global.TargetValue;
    }

    /**
     * 创建用户数值变更日志实体
     */
    protected createLogEntry() {
        return {
            userID: this.m_UserID
        } as global.TargetValueLog;
    }

    /**
     * 查找并清除关联用户数值变更数据
     */
    protected async findAndClearChangeEntries() {
        return this.associateService.findAndClear<global.TargetValueChange>(global.TargetValueChange.name, r => {
            return r.userID == this.m_UserID;
        });
    }
}
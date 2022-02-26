import { TargetRealTimeValueServiceBase } from '..';
import {
    DbFactoryBase,
    IEnum,
    IUnitOfWork,
    IUserService,
    IUserValueService,
    IValueConditionData,
    IValueData,
    IValueTypeData,
    model,
    NowTimeBase,
    StringGeneratorBase,
    ValueInterceptorFactoryBase
} from '../..';

/**
 * 用户数值服务
 */
export class UserValueService<T extends IUserService> extends TargetRealTimeValueServiceBase<
    model.global.UserValue,
    model.global.UserValueChange,
    model.global.UserValueLog,
    IValueTypeData
> implements IUserValueService<T> {
    /**
     * 获取用户数值实体
     */
    public get entry() {
        return new Promise<model.global.UserValue>(async (s, f) => {
            try {
                const rows = await this.associateStorageService.find(model.global.UserValue, r => {
                    return r.id == this.userService.userID;
                });
                s(rows[0]);
            } catch (ex) {
                f(ex);
            }
        });
    }

    /**
     * 
     * @param userService 用户服务
     * @param valueTypeEnum 数值枚举
     * @param dbFactory 数据库工厂
     * @param nowTime 当前时间
     * @param stringGenerator 字符串生成器
     * @param valueInterceptorFactory 数值拦截器工厂
     */
    public constructor(
        public userService: T,
        valueTypeEnum: IEnum<IValueTypeData>,
        dbFactory: DbFactoryBase,
        nowTime: NowTimeBase,
        stringGenerator: StringGeneratorBase,
        valueInterceptorFactory: ValueInterceptorFactoryBase,
    ) {
        super(
            userService.associateStorageService,
            dbFactory,
            stringGenerator,
            valueInterceptorFactory,
            0,
            model.global.UserValue,
            model.global.UserValueChange,
            model.global.UserValueLog,
            valueTypeEnum,
            nowTime,
        );
    }

    /**
     * 
     * @param uow 工作单元
     * @param conditions 条件
     */
    public async checkConditions(uow: IUnitOfWork, conditions: IValueConditionData[][]) {
        for (const r of conditions) {
            const tasks = r.reduce((memo, cr) => {
                const item = memo.find(sr => {
                    return sr.targetType == cr.targetType && sr.targetValue == cr.targetValue;
                });
                if (item) {
                    item.conditions.push(cr);
                }
                else {
                    memo.push({
                        conditions: [cr],
                        targetType: cr.targetType,
                        targetValue: cr.targetValue
                    });
                }
                return memo;
            }, [] as {
                conditions: IValueConditionData[],
                targetType: number,
                targetValue: number
            }[]).map(async cr => {
                const targetValueService = await this.userService.getTargetValueService(cr.targetType, cr.targetValue);
                return targetValueService.checkConditions(uow, [cr.conditions]);
            });
            const taskResults = await Promise.all(tasks);
            return taskResults.every(cr => cr);
        }

        return false;
    }

    /**
     * 更新数值
     * 
     * @param uow 工作单元
     * @param values 数值数组
     */
    public async update(uow: IUnitOfWork, values: IValueData[]) {
        const tasks = values.reduce((memo, r) => {
            const item = memo.find(cr => {
                return cr.targetType == r.targetType && cr.targetValue == r.targetValue;
            });
            if (item) {
                item.values.push(r);
            }
            else {
                memo.push({
                    values: [r],
                    targetType: r.targetType,
                    targetValue: r.targetValue
                });
            }
            return memo;
        }, [] as {
            values: IValueData[],
            targetType: number,
            targetValue: number
        }[]).map(async r => {
            const targetValueService = await this.userService.getTargetValueService(r.targetType, r.targetValue);
            return targetValueService.update(uow, r.values);
        });
        await Promise.all(tasks);
    }

    /**
     * 查找并清除关联用户数值变更数据
     */
    protected async findAndClearChangeEntries() {
        const changeEntries = await this.associateStorageService.find(model.global.UserValueChange, r => {
            return r.userID == this.userService.userID;
        });
        this.associateStorageService.clear(model.global.UserValueChange, r => {
            return r.userID == this.userService.userID;
        });
        return changeEntries;
    }

    /**
     * 创建用户数值变更实体
     */
    protected createChangeEntry() {
        return {
            userID: this.userService.userID
        } as model.global.UserValueChange;
    }

    /**
     * 创建用户数值实体
     */
    protected createEntry() {
        return {
            id: this.userService.userID
        } as model.global.UserValue;
    }

    /**
     * 创建用户数值变更日志实体
     */
    protected createLogEntry() {
        return {
            userID: this.userService.userID
        } as model.global.UserValueLog;
    }
}
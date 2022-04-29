import { DbValueServiceBase } from './value-service-base';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IRewardData,
    IUnitOfWork,
    IUserService,
    IUserValueService,
    IValueConditionData,
    IValueData,
    NowTimeBase,
    StringGeneratorBase,
    ValueInterceptorFactoryBase
} from '../../contract';
import { global } from '../../model';

/**
 * 用户数值服务
 */
export class DbUserValueService extends DbValueServiceBase<
    global.TargetValue,
    global.TargetValueChange,
    global.TargetValueLog
> implements IUserValueService {
    /**
     * 获取用户数值实体
     */
    public get entry() {
        return new Promise<global.TargetValue>(async (s, f) => {
            try {
                const rows = await this.associateService.find<global.TargetValue>(global.TargetValue.name, r => {
                    return r.id == this.userService.userID;
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
     * @param userService 用户服务
     * @param dbFactory 数据库工厂
     * @param enumFactory 枚举工厂
     * @param nowTime 当前时间
     * @param stringGenerator 字符串生成器
     * @param valueInterceptorFactory 数值拦截器工厂
     */
    public constructor(
        public userService: IUserService,
        dbFactory: DbFactoryBase,
        enumFactory: EnumFactoryBase,
        nowTime: NowTimeBase,
        stringGenerator: StringGeneratorBase,
        valueInterceptorFactory: ValueInterceptorFactoryBase,
    ) {
        super(
            userService.associateService,
            dbFactory,
            stringGenerator,
            valueInterceptorFactory,
            0,
            global.TargetValue,
            global.TargetValueChange,
            global.TargetValueLog,
            enumFactory,
            nowTime,
        );
    }

    /**
     * 检查条件
     * 
     * @param uow 工作单元
     * @param conditions 条件
     */
    public async checkConditions(uow: IUnitOfWork, conditions: IValueConditionData[][]) {
        if (!conditions?.length)
            return true;

        for (const r of conditions) {
            const tasks = r.reduce((memo, cr) => {
                const item = memo.find(sr => {
                    return sr.targetNo == cr.targetNo && sr.targetType == cr.targetType;
                });
                if (item) {
                    item.conditions.push(cr);
                }
                else {
                    memo.push({
                        conditions: [cr],
                        targetNo: cr.targetNo,
                        targetType: cr.targetType,
                    });
                }
                return memo;
            }, [] as {
                conditions: IValueConditionData[];
                targetNo: number;
                targetType: number;
            }[]).map(async cr => {
                if (cr.targetType) {
                    const targetValueService = await this.userService.getTargetValueService(cr.targetNo, cr.targetType);
                    return targetValueService.checkConditions(uow, [cr.conditions]);
                } else {
                    return super.checkConditions(uow, [cr.conditions]);
                }
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
                return cr.targetNo == r.targetNo && cr.targetType == r.targetType;
            });
            if (item) {
                item.values.push(r);
            }
            else {
                memo.push({
                    values: [r],
                    targetNo: r.targetNo,
                    targetType: r.targetType,
                });
            }
            return memo;
        }, [] as {
            values: IValueData[],
            targetNo: number;
            targetType: number,
        }[]).map(async r => {
            if (r.targetType) {
                const targetValueService = await this.userService.getTargetValueService(r.targetNo, r.targetType);
                return targetValueService.update(uow, r.values);
            } else {
                await super.update(uow, r.values);
            }
        });
        await Promise.all(tasks);
    }

    /**
     * 根据奖励更新数值
     * 
     * @param uow 工作单元
     * @param rewards 奖励
     * @param source 来源
     */
    public async updateByRewards(uow: IUnitOfWork, source: string, rewards: IRewardData[][]) {
        let res: IValueData[] = [];
        for (const r of rewards) {
            let rewardData: IRewardData;
            if (r.length == 1) {
                rewardData = r[0];
            } else {
                const total = r.reduce((memo, r) => {
                    return memo + r.weight * 1;
                }, 0);
                let rand = Math.floor(
                    Math.random() * total
                );
                rewardData = r.find(cr => {
                    rand -= cr.weight;
                    return rand <= 0;
                });
            }
            res.push({
                count: rewardData.count,
                source: source,
                valueType: rewardData.valueType
            });
        }

        await this.update(uow, res);

        return res;
    }

    /**
     * 创建用户数值实体
     */
    protected createEntry() {
        return {
            id: this.userService.userID
        } as global.TargetValue;
    }

    /**
     * 创建用户数值变更日志实体
     */
    protected createLogEntry() {
        return {
            userID: this.userService.userID
        } as global.TargetValueLog;
    }

    /**
     * 查找并清除关联用户数值变更数据
     */
    protected async findAndClearChangeEntries() {
        return this.associateService.findAndClear<global.TargetValueChange>(global.TargetValueChange.name, r => {
            return r.userID == this.userService.userID;
        });
    }
}
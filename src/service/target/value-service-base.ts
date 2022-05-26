import moment from 'moment';

import {
    EnumFactoryBase,
    ITargetValueService,
    IUnitOfWork,
    IValueConditionData,
    IValueData,
    NowTimeBase
} from '../../contract';
import { enum_, global } from '../../model';

/**
 * 目标数值服务基类
 */
export abstract class TargetValueServiceBase<T extends global.UserValue> implements ITargetValueService<T> {
    /**
     * 目标数值数据
     */
    public abstract get entry(): Promise<T>;

    /**
     * 构造函数
     * 
     * @param enumFactory 枚举工厂
     * @param nowTime 当前时间
     */
    public constructor(
        protected enumFactory: EnumFactoryBase,
        protected nowTime: NowTimeBase,
    ) { }

    /**
     * 验证条件
     * 
     * @param uow 工作单元
     * @param conditions 条件
     */
    public async checkConditions(uow: IUnitOfWork, conditions: IValueConditionData[][]) {
        if (!conditions?.length)
            return true;

        const now = await this.nowTime.unix();
        for (const r of conditions) {
            const tasks = r.map(async cr => {
                let aCount = await this.getCount(uow, cr.valueType);
                let op = cr.op;
                if (cr.op.endsWith('now-diff')) {
                    aCount = now - aCount;
                    op = cr.op.replace('now-diff', '') as enum_.RelationOperator;
                }
                switch (op) {
                    case enum_.RelationOperator.ge:
                        return aCount >= cr.count;
                    case enum_.RelationOperator.gt:
                        return aCount > cr.count;
                    case enum_.RelationOperator.le:
                        return aCount <= cr.count;
                    case enum_.RelationOperator.lt:
                        return aCount < cr.count;
                    default:
                        return aCount == cr.count;
                }
            });
            const res = await Promise.all(tasks);
            const ok = res.every(cr => cr);
            if (ok)
                return ok;
        }

        return false;
    }

    /**
     * 是否足够
     * 
     * @param uow 工作单元
     * @param values 数值数据
     */
    public async enough(uow: IUnitOfWork, values: IValueData[]) {
        return this.checkConditions(
            uow,
            [values.map(r => {
                return {
                    count: Math.abs(r.count),
                    op: enum_.RelationOperator.ge,
                    valueType: r.valueType
                };
            })]
        );
    }

    /**
     * 获取数量
     * 
     * @param _ 工作单元(忽略)
     * @param valueType 数值类型
     * @returns 
     */
    public async getCount(_: IUnitOfWork, valueType: number) {
        let entry = await this.entry;
        if (!entry) {
            entry = {
                values: {}
            } as T;
        }

        if (!(valueType in entry.values))
            entry.values[valueType] = 0;

        const valueTypeItem = await this.enumFactory.build(enum_.ValueTypeData).get(cr => {
            return cr.value == valueType;
        });
        if (valueTypeItem && valueTypeItem.data.dailyTime > 0) {
            const nowUnix = await this.nowTime.unix();
            const oldUnix = entry.values[valueTypeItem.data.dailyTime] || 0;
            const isSameDay = moment.unix(nowUnix).isSame(
                moment.unix(oldUnix),
                'day'
            );
            if (!isSameDay)
                entry.values[valueType] = 0;
        }

        return entry.values[valueType];
    }

    /**
     * 更新
     * 
     * @param uow 工作单元
     * @param values 数值数据
     */
    public abstract update(uow: IUnitOfWork, values: IValueData[]): Promise<void>;
}
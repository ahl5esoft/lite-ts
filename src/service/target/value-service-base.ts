import moment from 'moment';

import {
    EnumFactoryBase,
    ITargetValueService,
    IUnitOfWork,
    NowTimeBase,
} from '../../contract';
import { contract, enum_, global } from '../../model';

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
    public async checkConditions(uow: IUnitOfWork, conditions: contract.IValueCondition[][]) {
        if (!conditions?.length)
            return true;

        const now = await this.getNow(uow);
        for (const r of conditions) {
            const tasks = r.map(async cr => {
                let aCount = await this.getCount(uow, cr.valueType);
                let bCount = cr.count;
                let op: string = cr.op;
                if (cr.op.includes(enum_.RelationOperator.nowDiff)) {
                    aCount = now - aCount;
                    op = cr.op.replace(enum_.RelationOperator.nowDiff, '');
                } else if (cr.op.includes(enum_.RelationOperator.mod)) {
                    aCount = aCount % Math.floor(cr.count / 100);
                    op = cr.op.replace(enum_.RelationOperator.mod, '');
                    bCount = bCount % 100;
                }
                switch (op) {
                    case enum_.RelationOperator.ge:
                        return aCount >= bCount;
                    case enum_.RelationOperator.gt:
                        return aCount > bCount
                    case enum_.RelationOperator.le:
                        return aCount <= bCount;
                    case enum_.RelationOperator.lt:
                        return aCount < bCount;
                    default:
                        return aCount == bCount;
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
     * 获取数量
     * 
     * @param _ 工作单元(忽略)
     * @param valueType 数值类型
     */
    public async getCount(_: IUnitOfWork, valueType: number) {
        let entry = await this.entry;
        entry ??= {
            values: {}
        } as T;
        entry.values[valueType] ??= 0;

        const allValueTypeItem = await this.enumFactory.build(enum_.ValueTypeData).allItem;
        if (allValueTypeItem[valueType]?.data.dailyTime) {
            const nowUnix = await this.nowTime.unix();
            const oldUnix = entry.values[allValueTypeItem[valueType].data.dailyTime] || 0;
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
    public abstract update(uow: IUnitOfWork, values: contract.IValue[]): Promise<void>;

    /**
     * 获取当前时间
     * 
     * @param uow 工作单元
     */
    protected abstract getNow(uow: IUnitOfWork): Promise<number>;
}
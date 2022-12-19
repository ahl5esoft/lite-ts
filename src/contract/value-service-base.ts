import moment from 'moment';

import { EnumFactoryBase } from './enum-factory-base';
import { IUnitOfWork } from './i-unit-of-work';
import { contract, enum_, global } from '../model';

export abstract class ValueServiceBase<T extends global.UserValue> {
    public updateValues: contract.IValue[];

    public abstract get entry(): Promise<T>;
    public abstract get now(): Promise<number>;

    public constructor(
        protected enumFactory: EnumFactoryBase,
    ) { }

    public async checkConditions(uow: IUnitOfWork, conditions: contract.IValueCondition[][]) {
        if (!conditions?.length)
            return true;

        const now = await this.now;
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
                        return aCount > bCount;
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

    public async enough(uow: IUnitOfWork, times: number, consumeValues: contract.IValue[]) {
        return this.checkConditions(uow, [
            consumeValues.map(r => {
                return {
                    count: Math.abs(r.count) * times,
                    op: enum_.RelationOperator.ge,
                    valueType: r.valueType,
                } as contract.IValueCondition;
            })
        ]);
    }

    public async getCount(_: IUnitOfWork, valueType: number) {
        let entry = await this.entry;
        entry ??= {
            values: {}
        } as T;
        entry.values[valueType] ??= 0;

        const allValueTypeItem = await this.enumFactory.build(enum_.ValueTypeData).allItem;
        // 兼容
        if (allValueTypeItem[valueType]?.entry['dailyTime'] && !allValueTypeItem[valueType].entry.time) {
            allValueTypeItem[valueType].entry.time = {
                valueType: allValueTypeItem[valueType].entry['dailyTime']
            };
            allValueTypeItem[allValueTypeItem[valueType].entry['dailyTime']].entry.time = {
                momentType: 'day'
            };
        }

        if (allValueTypeItem[valueType]?.entry?.time?.valueType) {
            const now = await this.now;
            const oldNow = entry.values[allValueTypeItem[valueType].entry.time.valueType] || 0;
            const ok = moment.unix(now).isSame(
                moment.unix(oldNow),
                allValueTypeItem[allValueTypeItem[valueType].entry.time.valueType]?.entry?.time?.momentType ?? 'day'
            );
            if (!ok) {
                entry.values[valueType] = 0;
                entry.values[allValueTypeItem[valueType].entry.time.valueType] = now;
            }
        }

        return entry.values[valueType];
    }

    public abstract update(uow: IUnitOfWork, values: contract.IValue[]): Promise<void>;
}
import moment from 'moment';

import { EnumFactoryBase } from './enum-factory-base';
import { IEnumItem } from './i-enum-item';
import { IUnitOfWork } from './i-unit-of-work';
import { Integer } from './integer';
import { MathBase } from './math-base';
import { UserServiceBase } from './user-service-base';
import { contract, enum_, global } from '../model';

export abstract class ValueServiceBase<T extends global.UserValue> {
    public static buildNotEnoughErrorFunc: (consoumeCount: Integer, hasCount: Integer, valueType: number) => Error;

    public updateValues: contract.IValue[];

    public get entry() {
        return this.m_GetEntryFunc();
    }

    public constructor(
        public userService: UserServiceBase,
        protected enumFactory: EnumFactoryBase,
        protected math: MathBase,
        private m_GetEntryFunc: () => Promise<T>,
    ) { }

    public async checkConditions(uow: IUnitOfWork, conditions: contract.IValueCondition[][]) {
        if (!conditions?.length)
            return true;

        const now = await this.userService.now;
        for (const r of conditions) {
            const tasks = r.map(async cr => {
                let aCount = await this.getCount(uow, cr.valueType);
                let bCount = cr.count;
                let op: string = cr.op;
                if (cr.op.includes(enum_.RelationOperator.nowDiff)) {
                    aCount = this.math.subtract(now, aCount);
                    op = cr.op.replace(enum_.RelationOperator.nowDiff, '');
                } else if (cr.op.includes(enum_.RelationOperator.mod)) {
                    aCount = this.math.mod(aCount, this.math.divide(cr.count, 100));
                    op = cr.op.replace(enum_.RelationOperator.mod, '');
                    bCount = this.math.mod(bCount, 100);
                }
                switch (op) {
                    case enum_.RelationOperator.ge:
                        return this.math.gte(aCount, bCount);
                    case enum_.RelationOperator.gt:
                        return this.math.gt(aCount, bCount);
                    case enum_.RelationOperator.le:
                        return this.math.lte(aCount, bCount);
                    case enum_.RelationOperator.lt:
                        return this.math.lt(aCount, bCount);
                    default:
                        return this.math.eq(aCount, bCount);
                }
            });
            const res = await Promise.all(tasks);
            const ok = res.every(cr => cr);
            if (ok)
                return ok;
        }

        return false;
    }

    public async checkEnough(uow: IUnitOfWork, times: number, consumeValues: contract.IValue[]) {
        for (const r of consumeValues) {
            const count = await this.getCount(uow, r.valueType);

            if (this.math.lt(this.math.add(count, this.math.multiply(r.count, times)), 0))
                throw ValueServiceBase.buildNotEnoughErrorFunc(this.math.multiply(r.count, times), count, r.valueType);
        }
    }

    public async getCount(_: IUnitOfWork, valueType: number) {
        let entry = await this.entry;
        entry.values ??= {};
        entry.values[valueType] ??= 0;

        const allValueTypeItem = await this.enumFactory.build(enum_.ValueTypeData).allItem;
        await this.compatibleValueType(allValueTypeItem, valueType);
        const valueTypeEntry = allValueTypeItem[valueType]?.entry;
        if (valueTypeEntry?.time?.valueType) {
            const now = await this.userService.now;
            const oldNow = entry.values[valueTypeEntry.time.valueType];
            const ok = moment.unix(now).isSame(
                moment.unix(Number(oldNow)),
                allValueTypeItem[valueTypeEntry.time.valueType]?.entry?.time?.momentType ?? 'day'
            );
            if (!ok) {
                entry.values[valueType] = 0;
                entry.values[valueTypeEntry.time.valueType] = now;
            }
        }

        return entry.values[valueType];
    }

    protected async compatibleValueType(allItem: { [value: number]: IEnumItem<enum_.ValueTypeData>; }, valueType: number) {
        const entry = allItem[valueType]?.entry;
        if (entry?.['dailyTime'] && !entry.time) {
            entry.time = {
                valueType: entry['dailyTime']
            };
            allItem[entry['dailyTime']].entry.time = {
                momentType: 'day'
            };
        }
    }

    public abstract update(uow: IUnitOfWork, values: contract.IValue[]): Promise<void>;
}
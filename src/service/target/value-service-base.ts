import moment from 'moment';

import {
    IEnum,
    ITargetValueData,
    ITargetValueService,
    IUnitOfWork,
    IValueConditionData,
    IValueData,
    IValueTypeData,
    NowTimeBase
} from '../..';
import { enum_ } from '../../model';

export abstract class TargetValueServiceBase<T extends ITargetValueData, TValueType extends IValueTypeData> implements ITargetValueService {
    public constructor(
        protected valueTypeEnum: IEnum<TValueType>,
        protected nowTime: NowTimeBase,
    ) { }

    public async checkConditions(uow: IUnitOfWork, conditions: IValueConditionData[]) {
        for (const r of conditions) {
            const count = await this.getCount(uow, r.valueType);
            const ok = (r.op == enum_.RelationOperator.eq && count == r.count) ||
                (r.op == enum_.RelationOperator.ge && count >= r.count) ||
                (r.op == enum_.RelationOperator.gt && count > r.count) ||
                (r.op == enum_.RelationOperator.le && count <= r.count) ||
                (r.op == enum_.RelationOperator.lt && count < r.count);
            if (ok)
                continue;

            return false;
        }

        return true;
    }

    public async enough(uow: IUnitOfWork, values: IValueData[]) {
        return this.checkConditions(
            uow,
            values.map(r => {
                return {
                    count: Math.abs(r.count),
                    op: enum_.RelationOperator.ge,
                    valueType: r.valueType
                };
            })
        );
    }

    public async getCount(_: IUnitOfWork, valueType: number) {
        let entry = await this.getEntry();
        if (!entry) {
            entry = {
                values: {}
            } as T;
        }

        if (!(valueType in entry.values))
            entry.values[valueType] = 0;

        const valueTypeItem = await this.valueTypeEnum.get(cr => {
            return cr.value == valueType;
        });
        if (valueTypeItem && valueTypeItem.data.dailyTime != 0) {
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

    public abstract update(uow: IUnitOfWork, values: IValueData[]): Promise<void>;
    protected abstract getEntry(): Promise<T>;
}
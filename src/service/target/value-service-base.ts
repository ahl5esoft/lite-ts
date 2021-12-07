import { ITargetValueService, IUnitOfWork, IValueConditionData, IValueData } from '../..';
import { enum_ } from '../../model';

export abstract class TargetValueServiceBase implements ITargetValueService {
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

    public abstract getCount(uow: IUnitOfWork, valueType: number): Promise<number>;
    public abstract update(uow: IUnitOfWork, values: IValueData[]): Promise<void>;
}
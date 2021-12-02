import {
    DbFactoryBase,
    IAssociateStorageService,
    ITargetValueChangeData,
    ITargetValueData,
    ITargetValueService,
    IUnitOfWork,
    IValueConditionData,
    IValueData,
    StringGeneratorBase
} from '../..';
import { enum_ } from '../../model';

export abstract class TargetReadonlyValueServiceBase<
    T extends ITargetValueData,
    TChange extends ITargetValueChangeData> implements ITargetValueService {
    public constructor(
        protected associateStorageService: IAssociateStorageService,
        protected dbFactory: DbFactoryBase,
        protected stringGenerator: StringGeneratorBase,
        protected targetID: string,
        protected model: new () => T,
        protected changeModel: new () => TChange,
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

    public async getCount(_: IUnitOfWork, valueType: number) {
        const rows = await this.associateStorageService.find(this.model, 'id', this.targetID);
        return rows.length && rows[0].values[valueType] || 0;
    }

    public async update(uow: IUnitOfWork, values: IValueData[]) {
        const db = this.dbFactory.db(this.changeModel, uow);
        for (const r of values) {
            const entry = this.createChangeEntry(r);
            entry.count = r.count;
            entry.id = await this.stringGenerator.generate();
            entry.valueType = r.valueType;
            await db.add(entry);
        }
    }

    protected abstract createChangeEntry(value: IValueData): TChange;
}
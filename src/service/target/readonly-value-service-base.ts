import {
    DbFactoryBase,
    ITargetStorageService,
    ITargetValueChangeData,
    ITargetValueData,
    ITargetValueService,
    IUnitOfWork,
    IValueData,
    StringGeneratorBase
} from '../..';

export abstract class TargetReadonlyValueServiceBase<
    T extends ITargetValueData,
    TChange extends ITargetValueChangeData> implements ITargetValueService {
    public constructor(
        protected storageService: ITargetStorageService,
        protected dbFactory: DbFactoryBase,
        protected stringGenerator: StringGeneratorBase,
        protected targetID: string,
        protected model: new () => T,
        protected changeModel: new () => TChange,
    ) { }

    public async getCount(_: IUnitOfWork, valueType: number) {
        const rows = await this.storageService.findAssociates(this.model, 'id', this.targetID);
        return rows.length && rows[0].values[valueType] || 0;
    }

    public async update(uow: IUnitOfWork, ...values: IValueData[]) {
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
import { Inject, Service } from 'typedi';

import {
    DbFactoryBase,
    IAssociateStorageService,
    ITargetValueChangeData,
    ITargetValueData,
    ITargetValueService,
    IUnitOfWork,
    IValueData,
    StringGeneratorBase
} from '../../contract';

@Service()
export abstract class TargetReadonlyValueServiceBase<
    T extends ITargetValueData,
    TChange extends ITargetValueChangeData> implements ITargetValueService {
    @Inject()
    public dbFactory: DbFactoryBase;

    @Inject()
    public stringGenerator: StringGeneratorBase;

    public associateStorageService: IAssociateStorageService;

    public targetID: string;

    public model: new () => T;

    public changeModel: new () => TChange;

    public async getCount(_: IUnitOfWork, valueType: number) {
        const rows = await this.associateStorageService.find(this.model, 'id', this.targetID);
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
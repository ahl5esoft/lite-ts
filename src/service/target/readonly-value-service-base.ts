import {
    DbFactoryBase,
    IAssociateStorageService,
    ITargetValueChangeData,
    ITargetValueData,
    IUnitOfWork,
    IValueData,
    StringGeneratorBase
} from '../..';
import { TargetValueServiceBase } from './value-service-base';

export abstract class TargetReadonlyValueServiceBase<
    T extends ITargetValueData,
    TChange extends ITargetValueChangeData> extends TargetValueServiceBase {
    public constructor(
        protected associateStorageService: IAssociateStorageService,
        protected dbFactory: DbFactoryBase,
        protected stringGenerator: StringGeneratorBase,
        protected changeModel: new () => TChange,
    ) {
        super();
    }

    public async getCount(_: IUnitOfWork, valueType: number) {
        const data = await this.getEntry();
        return data?.values[valueType] || 0;
    }

    public async update(uow: IUnitOfWork, values: IValueData[]) {
        const db = this.dbFactory.db(this.changeModel, uow);
        for (const r of values) {
            const entry = this.createChangeEntry(r);
            entry.count = r.count;
            entry.id = await this.stringGenerator.generate();
            entry.valueType = r.valueType;
            await db.add(entry);

            this.associateStorageService.add(this.changeModel, entry);
        }
    }

    protected abstract createChangeEntry(value: IValueData): TChange;
    protected abstract getEntry(): Promise<T>;
}
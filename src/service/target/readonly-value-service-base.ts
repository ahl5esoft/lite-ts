import { TargetValueServiceBase } from './value-service-base';
import {
    DbFactoryBase,
    IAssociateStorageService,
    IEnum,
    ITargetValueChangeData,
    ITargetValueData,
    IUnitOfWork,
    IValueData,
    IValueTypeData,
    NowTimeBase,
    StringGeneratorBase
} from '../..';

export abstract class TargetReadonlyValueServiceBase<T extends ITargetValueData, TChange extends ITargetValueChangeData, TValueType extends IValueTypeData> extends TargetValueServiceBase<T, TValueType> {
    public constructor(
        protected associateStorageService: IAssociateStorageService,
        protected dbFactory: DbFactoryBase,
        protected stringGenerator: StringGeneratorBase,
        protected changeModel: new () => TChange,
        valueTypeEnum: IEnum<TValueType>,
        nowTime: NowTimeBase
    ) {
        super(valueTypeEnum, nowTime);
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
}
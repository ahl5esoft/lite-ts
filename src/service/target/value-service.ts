import moment from 'moment';

import { TargetReadonlyValueServiceBase } from './readonly-value-service-base';
import {
    DbFactoryBase,
    IAssociateStorageService,
    IEnum,
    ITargetValueChangeData,
    ITargetValueData,
    ITargetValueLogData,
    IUnitOfWork,
    IValueTypeData,
    MissionSubjectBase,
    NowTimeBase,
    StringGeneratorBase,
    ValueInterceptorFactoryBase,
} from '../..';

export abstract class TargetValueServiceBase<
    T extends ITargetValueData,
    TChange extends ITargetValueChangeData,
    TLog extends ITargetValueLogData,
    TValueType extends IValueTypeData> extends TargetReadonlyValueServiceBase<T, TChange> {
    public constructor(
        protected valueTypeEnum: IEnum<TValueType>,
        protected missionSubject: MissionSubjectBase,
        protected nowTime: NowTimeBase,
        protected valueInterceptorFactory: ValueInterceptorFactoryBase,
        protected targetType: number,
        protected model: new () => T,
        protected logModel: new () => TLog,
        associateStorageService: IAssociateStorageService,
        dbFactory: DbFactoryBase,
        stringGenerator: StringGeneratorBase,
        changeModel: new () => TChange,
    ) {
        super(associateStorageService, dbFactory, stringGenerator, changeModel);
    }

    public override async getCount(uow: IUnitOfWork, valueType: number) {
        let entry = await this.getEntry();
        const db = this.dbFactory.db(this.model, uow);
        if (!entry) {
            entry = this.createEntry();
            await db.add(entry);

            this.associateStorageService.add(this.model, entry);
        }

        let changeEntries = await this.findChangeEntries();
        const changeDb = this.dbFactory.db(this.changeModel, uow);
        const logDb = this.dbFactory.db(this.logModel, uow);
        for (const r of changeEntries) {
            await changeDb.remove(r);

            const interceptor = this.valueInterceptorFactory.build(this.targetType, r.valueType);
            const isIntercepted = await interceptor.before(uow, this, r);
            if (isIntercepted)
                continue;

            const logEntry = this.createLogEntry();
            logEntry.createdOn = await this.nowTime.unix();
            logEntry.id = await this.stringGenerator.generate();
            logEntry.oldCount = await super.getCount(uow, valueType);
            logEntry.valueType = r.valueType;

            if (!(r.valueType in entry.values))
                entry.values[r.valueType] = 0;

            const valueTypeItem = await this.valueTypeEnum.get(cr => {
                return cr.value == r.valueType;
            });
            if (valueTypeItem) {
                if (valueTypeItem.data.isReplace) {
                    entry.values[r.valueType] = r.count;
                } else if (valueTypeItem.data.todayTime != 0) {
                    const oldUnix = await super.getCount(uow, valueTypeItem.data.todayTime);
                    const isSameDay = moment.unix(logEntry.createdOn).isSame(
                        moment.unix(oldUnix),
                        'day'
                    );
                    if (!isSameDay)
                        entry.values[r.valueType] = 0;

                    entry.values[valueTypeItem.data.todayTime] = logEntry.createdOn;
                    entry.values[r.valueType] += r.count;
                } else {
                    entry.values[r.valueType] += r.count;
                }
            } else {
                entry.values[r.valueType] += r.count;
            }

            logEntry.count = entry.values[r.valueType];
            await logDb.add(logEntry);

            await interceptor.after(uow, this, r);

            if (this.missionSubject)
                await this.missionSubject.notify(uow, this, r.valueType);
        }

        if (changeEntries.length) {
            this.clearChangeEntries();

            await db.save(entry);
        }

        return super.getCount(uow, valueType);
    }

    protected abstract clearChangeEntries(): void;
    protected abstract createEntry(): T;
    protected abstract createLogEntry(): TLog;
    protected abstract findChangeEntries(): Promise<TChange[]>;
}
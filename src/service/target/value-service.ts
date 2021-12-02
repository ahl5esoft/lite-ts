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
        protected changeAssociateColumn: string,
        protected logModel: new () => TLog,
        associateStorageService: IAssociateStorageService,
        dbFactory: DbFactoryBase,
        stringGenerator: StringGeneratorBase,
        targetID: string,
        model: new () => T,
        changeModel: new () => TChange,
    ) {
        super(associateStorageService, dbFactory, stringGenerator, targetID, model, changeModel);
    }

    public override async getCount(uow: IUnitOfWork, valueType: number) {
        const db = this.dbFactory.db(this.model, uow);
        const rows = await this.associateStorageService.find(this.model, 'id', this.targetID);
        if (!rows.length) {
            const entry = this.createEntry();
            entry.id = this.targetID;
            entry.values = {};
            await db.add(entry);

            this.associateStorageService.add(this.model, 'id', entry);
            rows.push(entry);
        }

        let changeRows = await this.associateStorageService.find(this.changeModel, this.changeAssociateColumn, this.targetID);
        const changeDb = this.dbFactory.db(this.changeModel, uow);
        const logDb = this.dbFactory.db(this.logModel, uow);
        for (const r of changeRows) {
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

            if (!(r.valueType in rows[0].values))
                rows[0].values[r.valueType] = 0;

            const valueTypeItem = await this.valueTypeEnum.get(cr => {
                return cr.value == r.valueType;
            });
            if (valueTypeItem) {
                if (valueTypeItem.data.isReplace) {
                    rows[0].values[r.valueType] = r.count;
                } else if (valueTypeItem.data.todayTime != 0) {
                    const oldUnix = await super.getCount(uow, valueTypeItem.data.todayTime);
                    const isSameDay = moment.unix(logEntry.createdOn).isSame(
                        moment.unix(oldUnix),
                        'day'
                    );
                    if (!isSameDay)
                        rows[0].values[r.valueType] = 0;

                    rows[0].values[valueTypeItem.data.todayTime] = logEntry.createdOn;
                    rows[0].values[r.valueType] += r.count;
                } else {
                    rows[0].values[r.valueType] += r.count;
                }
            } else {
                rows[0].values[r.valueType] += r.count;
            }

            logEntry.count = rows[0].values[r.valueType];
            await logDb.add(logEntry);

            await interceptor.after(uow, this, r);

            if (this.missionSubject)
                await this.missionSubject.notify(uow, this, r.valueType);
        }

        this.associateStorageService.clear(this.changeModel, this.targetID);

        if (changeRows.length)
            await db.save(rows[0]);

        return super.getCount(uow, valueType);
    }

    protected abstract createEntry(): T;
    protected abstract createLogEntry(): TLog;
}
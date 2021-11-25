import moment from 'moment';

import { TargetReadonlyValueServiceBase } from '.';
import {
    DbFactoryBase,
    IEnum,
    ITargetStorageService,
    ITargetValueChangeData,
    ITargetValueData,
    ITargetValueLogData,
    IUnitOfWork,
    IValueTypeData,
    NowTimeBase,
    StringGeneratorBase
} from '../..';

export abstract class TargetValueServiceBase<
    T extends ITargetValueData,
    TChange extends ITargetValueChangeData,
    TLog extends ITargetValueLogData,
    TValueType extends IValueTypeData> extends TargetReadonlyValueServiceBase<T, TChange> {
    public constructor(
        private m_ValueTypeEnum: IEnum<TValueType>,
        private m_NowTime: NowTimeBase,
        private m_ChangeAssociateColumn: string,
        private m_LogModel: new () => TLog,
        storageService: ITargetStorageService,
        dbFactory: DbFactoryBase,
        stringGenerator: StringGeneratorBase,
        targetID: string,
        model: new () => T,
        changeModel: new () => TChange,
    ) {
        super(storageService, dbFactory, stringGenerator, targetID, model, changeModel);
    }

    public override async getCount(uow: IUnitOfWork, valueType: number) {
        const db = this.dbFactory.db(this.model, uow);
        const rows = await this.storageService.findAssociates(this.model, 'id', this.targetID);
        if (!rows.length) {
            const entry = this.createEntry();
            entry.id = this.targetID;
            entry.values = {};
            await db.add(entry);

            this.storageService.addAssociate(this.model, 'id', entry);
            rows.push(entry);
        }

        let changeRows = await this.storageService.findAssociates(this.changeModel, this.m_ChangeAssociateColumn, this.targetID);
        const changeDb = this.dbFactory.db(this.changeModel, uow);
        const logDb = this.dbFactory.db(this.m_LogModel, uow);
        for (const r of changeRows) {
            await changeDb.remove(r);

            const logEntry = this.createLogEntry();
            logEntry.createdOn = await this.m_NowTime.unix();
            logEntry.id = await this.stringGenerator.generate();
            logEntry.oldCount = await super.getCount(uow, valueType);
            logEntry.valueType = r.valueType;

            if (!(r.valueType in rows[0].values))
                rows[0].values[r.valueType] = 0;

            const valueTypeItem = await this.m_ValueTypeEnum.get(cr => {
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
        }

        this.storageService.clear(this.changeModel, this.targetID);

        if (changeRows.length)
            await db.save(rows[0]);

        return super.getCount(uow, valueType);
    }

    protected abstract createEntry(): T;
    protected abstract createLogEntry(): TLog;
}
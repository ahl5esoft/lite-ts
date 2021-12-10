import moment from 'moment';

import { TargetValueServiceBase } from './value-service-base';
import {
    DbFactoryBase,
    IAssociateStorageService,
    IEnum,
    ITargetValueChangeData,
    ITargetValueData,
    ITargetValueLogData,
    IUnitOfWork,
    IValueData,
    IValueTypeData,
    NowTimeBase,
    StringGeneratorBase,
    ValueInterceptorFactoryBase,
} from '../..';

export abstract class TargetRealTimeValueServiceBase<
    T extends ITargetValueData,
    TChange extends ITargetValueChangeData,
    TLog extends ITargetValueLogData,
    TValueType extends IValueTypeData> extends TargetValueServiceBase<T, TValueType> {
    public constructor(
        protected associateStorageService: IAssociateStorageService,
        protected dbFactory: DbFactoryBase,
        protected stringGenerator: StringGeneratorBase,
        protected valueInterceptorFactory: ValueInterceptorFactoryBase,
        protected targetType: number,
        protected model: new () => T,
        protected changeModel: new () => TChange,
        protected logModel: new () => TLog,
        valueTypeEnum: IEnum<TValueType>,
        nowTime: NowTimeBase,
    ) {
        super(valueTypeEnum, nowTime);
    }

    public override async getCount(uow: IUnitOfWork, valueType: number) {
        let changeEntries = await this.findChangeEntries();
        const changeDb = this.dbFactory.db(this.changeModel, uow);
        for (const r of changeEntries) {
            await changeDb.remove(r);

            await this.update(uow, [r]);
        }

        return super.getCount(uow, valueType);
    }

    public async update(uow: IUnitOfWork, values: IValueData[]) {
        let entry = await this.getEntry();
        const db = this.dbFactory.db(this.model, uow);
        if (!entry) {
            entry = this.createEntry();
            entry.values = {};
            await db.add(entry);

            this.associateStorageService.add(this.model, entry);
        }

        const logDb = this.dbFactory.db(this.logModel, uow);
        for (const r of values) {
            if (!(r.valueType in entry.values))
                entry.values[r.valueType] = 0;

            const interceptor = this.valueInterceptorFactory.build(this.targetType, r.valueType);
            const isIntercepted = await interceptor.before(uow, this, r);
            if (isIntercepted)
                continue;

            const logEntry = this.createLogEntry();
            logEntry.id = await this.stringGenerator.generate();
            logEntry.oldCount = entry.values[r.valueType];
            logEntry.valueType = r.valueType;

            const valueTypeItem = await this.valueTypeEnum.get(cr => {
                return cr.value == r.valueType;
            });
            if (valueTypeItem) {
                if (valueTypeItem.data.isReplace) {
                    entry.values[r.valueType] = r.count;
                } else if (valueTypeItem.data.dailyTime != 0) {
                    const nowUnix = await this.nowTime.unix();
                    const oldUnix = entry.values[valueTypeItem.data.dailyTime] || 0;
                    const isSameDay = moment.unix(nowUnix).isSame(
                        moment.unix(oldUnix),
                        'day'
                    );
                    if (!isSameDay)
                        entry.values[r.valueType] = 0;

                    entry.values[valueTypeItem.data.dailyTime] = nowUnix;
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
        }

        await db.save(entry);
    }

    protected abstract clearChangeEntries(): void;
    protected abstract createEntry(): T;
    protected abstract createLogEntry(): TLog;
    protected abstract findChangeEntries(): Promise<TChange[]>;
    protected abstract getEntry(): Promise<T>;
}
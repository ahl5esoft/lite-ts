import { opentracing } from 'jaeger-client';
import moment from 'moment';

import { CustomError } from '../error';
import { TargetValueServiceBase } from '../target';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IUnitOfWork,
    IUserAssociateService,
    NowTimeBase,
    StringGeneratorBase,
    ValueInterceptorFactoryBase,
} from '../../contract';
import { contract, enum_, global } from '../../model';

export abstract class DbValueServiceBase<
    T extends global.UserValue,
    TChange extends global.UserValueChange,
    TLog extends global.UserValueLog
> extends TargetValueServiceBase<T> {
    public constructor(
        protected associateService: IUserAssociateService,
        protected dbFactory: DbFactoryBase,
        protected stringGenerator: StringGeneratorBase,
        protected valueInterceptorFactory: ValueInterceptorFactoryBase,
        protected tracerSpan: opentracing.Span,
        protected model: new () => T,
        protected changeModel: new () => TChange,
        protected logModel: new () => TLog,
        enumFactory: EnumFactoryBase,
        nowTime: NowTimeBase,
    ) {
        super(enumFactory, nowTime);
    }

    /**
     * 获取数值数量
     * 获取数值变更数据并清理缓存
     * 
     * @param uow 工作单元
     * @param valueType 数值类型
     */
    public async getCount(uow: IUnitOfWork, valueType: number) {
        const tracerSpan = this.tracerSpan ? opentracing.globalTracer().startSpan('value.getCount', {
            childOf: this.tracerSpan,
        }) : null;

        const changeEntries = await this.findAndClearChangeEntries();
        const changeDb = this.dbFactory.db(this.changeModel, uow);
        if (changeEntries.length) {
            tracerSpan?.log?.({
                changes: changeEntries
            });

            for (const r of changeEntries)
                await changeDb.remove(r);
            await this.update(uow, changeEntries);
        }

        const res = await super.getCount(uow, valueType);
        tracerSpan?.log?.({
            valueType,
            result: res,
        })?.finish?.();
        return res;
    }

    public async update(uow: IUnitOfWork, values: contract.IValue[]) {
        this.updateValues ??= [];
        this.updateValues.push(...values);

        const tracerSpan = this.tracerSpan ? opentracing.globalTracer().startSpan('value.update', {
            childOf: this.tracerSpan,
        }) : null;

        const db = this.dbFactory.db(this.model, uow);
        let entry = await this.entry;
        if (!entry) {
            entry = this.createEntry();
            entry.values = {};
            await db.add(entry);

            this.associateService.add(this.model.name, entry);
        }

        const logDb = this.dbFactory.db(this.logModel, uow);
        const allValueTypeItem = await this.enumFactory.build(enum_.ValueTypeData).allItem;
        const nowUnix = await this.getNow(uow);
        for (const r of values) {
            if (typeof r.valueType != 'number' || typeof r.count != 'number' || isNaN(r.count))
                continue;

            entry.values[r.valueType] ??= 0;

            if (!allValueTypeItem[r.valueType]?.data.isReplace && r.count == 0)
                continue;

            const interceptor = await this.valueInterceptorFactory.build(r);
            const isIntercepted = await interceptor.before(uow, this, r);
            if (isIntercepted)
                continue;

            const logEntry = this.createLogEntry();
            logEntry.id = await this.stringGenerator.generate();
            logEntry.oldCount = entry.values[r.valueType];
            logEntry.source = r.source;
            logEntry.valueType = r.valueType;

            if (allValueTypeItem[r.valueType]) {
                if (allValueTypeItem[r.valueType].data.isReplace) {
                    entry.values[r.valueType] = r.count;
                } else if (allValueTypeItem[r.valueType].data.dailyTime > 0) {
                    const oldUnix = entry.values[allValueTypeItem[r.valueType].data.dailyTime] || 0;
                    const isSameDay = moment.unix(nowUnix).isSame(
                        moment.unix(oldUnix),
                        'day'
                    );
                    if (!isSameDay) {
                        entry.values[r.valueType] = 0;
                        logEntry.source += '(每日重置)';
                    }

                    entry.values[allValueTypeItem[r.valueType].data.dailyTime] = nowUnix;
                    entry.values[r.valueType] += r.count;
                } else if (allValueTypeItem[r.valueType].data.time?.valueType > 0) {
                    const oldUnix = entry.values[allValueTypeItem[r.valueType].data.time.valueType] || 0;
                    const isSame = moment.unix(nowUnix).isSame(
                        moment.unix(oldUnix),
                        allValueTypeItem[allValueTypeItem[r.valueType].data.time.valueType].data.time.momentType
                    );
                    if (!isSame) {
                        entry.values[r.valueType] = 0;
                        logEntry.source += '(每周期重置)';
                    }

                    entry.values[allValueTypeItem[r.valueType].data.time.valueType] = nowUnix;
                    entry.values[r.valueType] += r.count;
                } else {
                    entry.values[r.valueType] += r.count;
                }
            } else {
                entry.values[r.valueType] += r.count;
            }

            if (entry.values[r.valueType] < 0 && !allValueTypeItem[r.valueType]?.data.isNegative) {
                entry.values[r.valueType] = logEntry.oldCount;
                throw new CustomError(enum_.ErrorCode.valueTypeNotEnough, {
                    consume: Math.abs(r.count),
                    count: logEntry.oldCount,
                    valueType: r.valueType,
                });
            }

            logEntry.count = entry.values[r.valueType];
            if (logEntry.oldCount != logEntry.count)
                await logDb.add(logEntry);

            await interceptor.after(uow, this, r);
        }

        await db.save(entry);

        tracerSpan?.log?.({ values })?.finish?.();
    }

    protected abstract createEntry(): T;
    protected abstract createLogEntry(): TLog;
    protected abstract findAndClearChangeEntries(): Promise<TChange[]>;
}
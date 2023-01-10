import { opentracing } from 'jaeger-client';
import moment from 'moment';

import {
    DbFactoryBase,
    DbRepositoryBase,
    EnumFactoryBase,
    IUnitOfWork,
    RedisBase,
    StringGeneratorBase,
    UserServiceBase,
    ValueInterceptorFactoryBase,
    ValueServiceBase,
} from '../../contract';
import { contract, enum_, global } from '../../model';

export class DbValueService<
    T extends global.UserValue,
    TChange extends global.UserValueChange,
    TLog extends global.UserValueLog
> extends ValueServiceBase<T> {
    public constructor(
        protected dbFactory: DbFactoryBase,
        protected redis: RedisBase,
        protected stringGenerator: StringGeneratorBase,
        protected valueInterceptorFactory: ValueInterceptorFactoryBase,
        protected parentTracerSpan: opentracing.Span,
        protected changeModel: new () => TChange,
        private m_CreateEntryFunc: () => T,
        private m_CreateLogEntryFunc: () => TLog,
        private m_FindAndClearChangeEntriesPredicate: (r: TChange) => boolean,
        userService: UserServiceBase,
        enumFactory: EnumFactoryBase,
        getEntryFunc: () => Promise<T>,
    ) {
        super(userService, enumFactory, getEntryFunc);
    }

    public async getCount(uow: IUnitOfWork, valueType: number) {
        const tracerSpan = opentracing.globalTracer().startSpan('value.getCount', {
            childOf: this.parentTracerSpan,
        });

        const changeEntries = await this.userService.associateService.findAndClear<TChange>(this.changeModel.name, this.m_FindAndClearChangeEntriesPredicate);
        const changeDb = this.dbFactory.db(this.changeModel, uow);
        const redisKey = [this.changeModel.name, this.userService.userID].join(':');
        if (changeEntries.length) {
            tracerSpan.log({
                changes: changeEntries
            });

            const temp = [];
            for (const r of changeEntries) {
                await changeDb.remove(r);

                const ok = this.redis.hsetnx(redisKey, r.id, '');
                if (ok)
                    temp.push(r);
            }

            await this.update(uow, temp);
            await this.redis.expire(redisKey, 10);
        }

        const res = await super.getCount(uow, valueType);
        tracerSpan.log({
            valueType,
            result: res,
        }).finish();
        return res;
    }

    public async update(uow: IUnitOfWork, values: contract.IValue[]) {
        if (!values?.length)
            return;

        this.updateValues = values;

        const tracerSpan = opentracing.globalTracer().startSpan('value.update', {
            childOf: this.parentTracerSpan,
        });

        const newEntry = this.m_CreateEntryFunc();
        const db = this.dbFactory.db(newEntry.constructor as any, uow);
        let entry = await this.entry;
        if (!entry) {
            entry = newEntry;
            entry.values ??= {};
            await db.add(entry);

            this.userService.associateService.add(newEntry.constructor.name, entry);
        }

        let logDb: DbRepositoryBase<TLog>;
        const allValueTypeItem = await this.enumFactory.build(enum_.ValueTypeData).allItem;
        const nowUnix = await this.userService.now;
        for (const r of values) {
            if (typeof r.valueType != 'number' || typeof r.count != 'number' || isNaN(r.count))
                continue;

            entry.values[r.valueType] ??= 0;

            const valueTypeEntry = allValueTypeItem[r.valueType]?.entry;
            if (!valueTypeEntry?.isReplace && r.count == 0)
                continue;

            const interceptor = await this.valueInterceptorFactory.build(r);
            const isIntercepted = await interceptor.before(uow, this, r);
            if (isIntercepted)
                continue;

            const logEntry = this.m_CreateLogEntryFunc();
            if (!logDb)
                logDb = this.dbFactory.db(logEntry.constructor as any, uow);

            logEntry.id = await this.stringGenerator.generate();
            logEntry.oldCount = entry.values[r.valueType];
            logEntry.source = r.source;
            logEntry.valueType = r.valueType;

            if (valueTypeEntry) {
                this.compatibleValueType(allValueTypeItem, r.valueType);

                if (valueTypeEntry.isReplace) {
                    entry.values[r.valueType] = r.count;
                } else if (valueTypeEntry.time?.valueType > 0) {
                    const oldUnix = entry.values[valueTypeEntry.time.valueType] || 0;
                    const isSame = moment.unix(nowUnix).isSame(
                        moment.unix(oldUnix),
                        allValueTypeItem[valueTypeEntry.time.valueType].entry.time.momentType
                    );
                    if (!isSame) {
                        entry.values[r.valueType] = 0;
                        logEntry.source += '(时间重置)';
                    }

                    entry.values[valueTypeEntry.time.valueType] = nowUnix;
                    entry.values[r.valueType] += r.count;
                } else {
                    entry.values[r.valueType] += r.count;
                }
            } else {
                entry.values[r.valueType] += r.count;
            }

            if (valueTypeEntry) {
                if (entry.values[r.valueType] < 0 && !valueTypeEntry.isNegative) {
                    entry.values[r.valueType] = logEntry.oldCount;
                    throw ValueServiceBase.buildNotEnoughErrorFunc(r.count, logEntry.oldCount, r.valueType);
                }

                if (entry.values[r.valueType] > valueTypeEntry.range?.max)
                    entry.values[r.valueType] = valueTypeEntry.range.max;

                if (entry.values[r.valueType] < valueTypeEntry.range?.min)
                    entry.values[r.valueType] = valueTypeEntry.range.min;
            }

            logEntry.count = entry.values[r.valueType];
            if (logEntry.oldCount != logEntry.count)
                await logDb.add(logEntry);

            await interceptor.after(uow, this, r);
        }

        await db.save(entry);

        tracerSpan.log({ values }).finish();
    }
}
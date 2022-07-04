import moment from 'moment';

import { CustomError } from '../error';
import { TargetValueServiceBase } from '../target';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IUnitOfWork,
    IUserAssociateService,
    IValueData,
    NowTimeBase,
    StringGeneratorBase,
    ValueInterceptorFactoryBase,
} from '../../contract';
import { enum_, global } from '../../model';

/**
 * 数据库数值服务
 */
export abstract class DbValueServiceBase<
    T extends global.UserValue,
    TChange extends global.UserValueChange,
    TLog extends global.UserValueLog,
    > extends TargetValueServiceBase<T> {
    /**
     * 构造函数
     * 
     * @param associateService 关联存储服务
     * @param dbFactory 数据库工厂
     * @param stringGenerator 字符串生成器
     * @param valueInterceptorFactory 数值拦截器工厂
     * @param model 数值模型
     * @param changeModel 数值变更模型
     * @param logModel 数值日志模型
     * @param enumFactory 枚举工厂
     * @param nowTime 当前时间
     */
    public constructor(
        protected associateService: IUserAssociateService,
        protected dbFactory: DbFactoryBase,
        protected stringGenerator: StringGeneratorBase,
        protected valueInterceptorFactory: ValueInterceptorFactoryBase,
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
        const changeEntries = await this.findAndClearChangeEntries();
        const changeDb = this.dbFactory.db(this.changeModel, uow);
        for (const r of changeEntries) {
            await changeDb.remove(r);

            await this.update(uow, [r]);
        }

        return super.getCount(uow, valueType);
    }

    /**
     * 更新数值
     * 
     * @param uow 工作单元
     * @param values 数值数据
     */
    public async update(uow: IUnitOfWork, values: IValueData[]) {
        let entry = await this.entry;
        const db = this.dbFactory.db(this.model, uow);
        if (!entry) {
            entry = this.createEntry();
            entry.values = {};
            await db.add(entry);

            this.associateService.add(this.model.name, entry);
        }

        const logDb = this.dbFactory.db(this.logModel, uow);
        for (const r of values) {
            const valueTypeItem = await this.enumFactory.build(enum_.ValueTypeData).get(cr => {
                return cr.value == r.valueType;
            });
            if (!valueTypeItem?.data.isReplace && r.count == 0)
                continue;

            if (!(r.valueType in entry.values))
                entry.values[r.valueType] = 0;

            const interceptor = this.valueInterceptorFactory.build(r.valueType);
            const isIntercepted = await interceptor.before(uow, this, r);
            if (isIntercepted)
                continue;

            const logEntry = this.createLogEntry();
            logEntry.id = await this.stringGenerator.generate();
            logEntry.oldCount = entry.values[r.valueType];
            logEntry.source = r.source;
            logEntry.valueType = r.valueType;

            if (valueTypeItem) {
                if (valueTypeItem.data.isReplace) {
                    entry.values[r.valueType] = r.count;
                } else if (valueTypeItem.data.dailyTime > 0) {
                    const nowUnix = await this.getNow(uow);
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

                if (entry.values[r.valueType] < 0 && !valueTypeItem.data.isNegative) {
                    throw new CustomError(enum_.ErrorCode.valueTypeNotEnough, {
                        consume: Math.abs(r.count),
                        count: logEntry.oldCount,
                        valueType: r.valueType,
                    });
                }
            } else {
                entry.values[r.valueType] += r.count;
            }

            logEntry.count = entry.values[r.valueType];
            if (logEntry.oldCount != logEntry.count)
                await logDb.add(logEntry);

            await interceptor.after(uow, this, r);
        }

        await db.save(entry);
    }

    /**
     * 创建T
     */
    protected abstract createEntry(): T;
    /**
     * 创建TLog
     */
    protected abstract createLogEntry(): TLog;
    /**
     * 获取并清除变更数据
     */
    protected abstract findAndClearChangeEntries(): Promise<TChange[]>;
}
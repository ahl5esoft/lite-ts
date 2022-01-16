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

/**
 * 目标试试数值服务
 */
export abstract class TargetRealTimeValueServiceBase<
    T extends ITargetValueData,
    TChange extends ITargetValueChangeData,
    TLog extends ITargetValueLogData,
    TValueType extends IValueTypeData> extends TargetValueServiceBase<T, TValueType> {

    /**
     * 构造函数
     * 
     * @param associateStorageService 关联存储服务
     * @param dbFactory 数据库工厂
     * @param stringGenerator 字符串生成器
     * @param valueInterceptorFactory 数值拦截器工厂
     * @param targetType 目标类型
     * @param model 数值模型
     * @param changeModel 数值变更模型
     * @param logModel 数值日志模型
     * @param valueTypeEnum 数值类型枚举接口
     * @param nowTime 当前时间接口
     */
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

    /**
     * 获取数值数量
     * 获取数值变更数据并清理缓存
     * 
     * 
     * @param uow 工作单元
     * @param valueType 数值类型
     */
    public async getCount(uow: IUnitOfWork, valueType: number) {
        let changeEntries = await this.findAndClearChangeEntries();
        const changeDb = this.dbFactory.db(this.changeModel, uow);
        for (const r of changeEntries) {
            await changeDb.remove(r);

            await this.update(uow, [r]);
        }

        return super.getCount(uow, valueType);
    }

    public async update(uow: IUnitOfWork, values: IValueData[]) {
        let entry = await this.entry;
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
                } else if (valueTypeItem.data.dailyTime > 0) {
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

    protected abstract createEntry(): T;
    protected abstract createLogEntry(): TLog;
    protected abstract findAndClearChangeEntries(): Promise<TChange[]>;
}
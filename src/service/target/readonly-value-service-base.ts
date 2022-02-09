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

/**
 * 只读数值服务
 */
export abstract class TargetReadonlyValueServiceBase<T extends ITargetValueData, TChange extends ITargetValueChangeData, TValueType extends IValueTypeData> extends TargetValueServiceBase<T, TValueType> {
    /**
     * 构造函数
     * 
     * @param associateStorageService 关联存储服务
     * @param dbFactory 数据库工厂
     * @param stringGenerator 字符串生成器
     * @param changeModel 变更模型
     * @param valueTypeEnum 数值类型枚举
     * @param nowTime 当前时间
     */
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

    /**
     * 更新
     * 
     * @param uow 工作单元
     * @param values 数值数据
     */
    public async update(uow: IUnitOfWork, values: IValueData[]) {
        const db = this.dbFactory.db(this.changeModel, uow);
        for (const r of values) {
            const entry = this.createChangeEntry(r);
            entry.count = r.count;
            entry.id = await this.stringGenerator.generate();
            entry.source = r.source;
            entry.valueType = r.valueType;
            await db.add(entry);

            this.associateStorageService.add(this.changeModel, entry);
        }
    }

    /**
     * 创建变更数据
     * 
     * @param value 数值数据
     */
    protected abstract createChangeEntry(value: IValueData): TChange;
}
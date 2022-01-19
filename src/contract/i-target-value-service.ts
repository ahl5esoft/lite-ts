import { ITargetValueData } from './i-target-value-data';
import { IUnitOfWork } from './i-unit-of-work';
import { IValueData } from './i-value-data';
import { IValueConditionData } from './i-value-condition-data';

/**
 * 目标数值服务接口
 */
export interface ITargetValueService {
    /**
     * 数据
     */
    readonly entry: Promise<ITargetValueData>;

    /**
     * 判断条件是否满足
     * 
     * @param uow 工作单元
     * @param conditions 数值条件
     */
    checkConditions(uow: IUnitOfWork, conditions: IValueConditionData[][]): Promise<boolean>;

    /**
     * 是否足够
     * 
     * @param uow 工作单元
     * @param values 数值结构数组
     */
    enough(uow: IUnitOfWork, values: IValueData[]): Promise<boolean>;

    /**
     * 获取数值数量
     * 
     * @param uow 工作单元
     * @param valueType 数值类型
     */
    getCount(uow: IUnitOfWork, valueType: number): Promise<number>;

    /**
     * 更新数值
     * 
     * @param uow 工作单元
     * @param values 数值结构数组
     */
    update(uow: IUnitOfWork, values: IValueData[]): Promise<void>;
}
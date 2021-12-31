import { ITargetValueService } from './i-target-value-service';
import { IUnitOfWork } from './i-unit-of-work';

/**
 * 任务观察接口
 */
export interface IMissionObserver {
    /**
     * 更新
     * 
     * @param uow 工作单元
     * @param valueService 数值服务
     * @param valueType 数值类型
     */
    update(uow: IUnitOfWork, valueService: ITargetValueService, valueType: number): Promise<void>;
}
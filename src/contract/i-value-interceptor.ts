import { ITargetValueService } from './i-target-value-service';
import { IUnitOfWork } from './i-unit-of-work';
import { IValueData } from './i-value-data';
import { global } from '../model';

/**
 * 数值拦截器
 */
export interface IValueInterceptor {
    /**
     * 目标数值更新后触发
     * 
     * @param uow 工作单元
     * @param valueService 数值服务
     * @param valueData 数值结构
     */
    after(uow: IUnitOfWork, valueService: ITargetValueService<global.UserValue>, valueData: IValueData): Promise<void>;

    /**
     * 目标数值更新前触发, 如果返回true则目标数值不更新
     * 
     * @param uow 工作单元
     * @param valueService 数值服务
     * @param valueData 数值结构
     */
    before(uow: IUnitOfWork, valueService: ITargetValueService<global.UserValue>, valueData: IValueData): Promise<boolean>;
}
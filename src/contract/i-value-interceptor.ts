import { IUnitOfWork } from './i-unit-of-work';
import { ValueServiceBase } from './value-service-base';
import { contract, global } from '../model';

/**
 * 数值拦截器
 */
export interface IValueInterceptor {
    /**
     * 目标数值更新后触发
     * 
     * @param uow 工作单元
     * @param valueService 数值服务
     * @param changeValue 变更数值
     */
    after(uow: IUnitOfWork, valueService: ValueServiceBase<global.UserValue>, changeValue: contract.IValue): Promise<void>;
    /**
     * 目标数值更新前触发, 如果返回true则目标数值不更新
     * 
     * @param uow 工作单元
     * @param valueService 数值服务
     * @param changeValue 变更数值
     */
    before(uow: IUnitOfWork, valueService: ValueServiceBase<global.UserValue>, changeValue: contract.IValue): Promise<boolean>;
}
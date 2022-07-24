import { ITargetValueService } from './i-target-value-service';
import { IUnitOfWork } from './i-unit-of-work';
import { UserServiceBase } from './user-service-base';
import { global } from '../model';

/**
 * 用户数值服务
 */
export interface IUserValueService extends ITargetValueService<global.UserValue> {
    /**
     * 用户服务
     */
    readonly userService: UserServiceBase;
    /**
     * 获取当前时间
     * 
     * @param uow 工作单元
     */
    getNow(uow: IUnitOfWork): Promise<number>;
}
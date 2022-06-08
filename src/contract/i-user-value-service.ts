import { IRewardData } from './i-reward-data';
import { ITargetValueService } from './i-target-value-service';
import { IUnitOfWork } from './i-unit-of-work';
import { IUserService } from './i-user-service';
import { IValueData } from './i-value-data';
import { global } from '../model';

/**
 * 用户数值服务
 */
export interface IUserValueService extends ITargetValueService<global.UserValue> {
    /**
     * 用户服务
     */
    readonly userService: IUserService;
    /**
     * 获取当前时间
     * 
     * @param uow 工作单元
     */
    getNow(uow: IUnitOfWork): Promise<number>;
    /**
     * 
     * @param uow 
     * @param rewards 
     * @param source 
     */
    updateByRewards(uow: IUnitOfWork, source: string, rewards: IRewardData[][]): Promise<IValueData[]>;
}
import { ITargetValueService } from './i-target-value-service';
import { IUserAssociateService } from './i-user-associate-service';
import { IUserValueService } from './i-user-value-service';
import { global } from '../model';

/**
 * 用户服务
 */
export interface IUserService {
    /**
     * 关联存储服务
     */
    readonly associateService: IUserAssociateService;
    /**
     * 数值服务
     */
    readonly valueService: IUserValueService;
    /**
     * 用户ID
     */
    readonly userID: string;

    /**
     * 获取目标数值服务
     * 
     * @param targetNo 目标编号
     * @param targetType 目标类型
     */
    getTargetValueService(targetNo: number, targetType: number): Promise<ITargetValueService<global.TargetValue>>;
}
import { IAssociateStorageService } from './i-associate-storage-service';
import { ITargetValueService } from './i-target-value-service';
import { IUserValueService } from './i-user-value-service';

/**
 * 用户服务
 */
export interface IUserService {
    /**
     * 关联存储服务
     */
    readonly associateStorageService: IAssociateStorageService;
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
     * @param targetType 目标类型
     * @param targetValue 目标值
     */
    getTargetValueService(targetType: number, targetValue: number): Promise<ITargetValueService>;
}
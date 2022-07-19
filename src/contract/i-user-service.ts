import { IUserAssociateService } from './i-user-associate-service';
import { IUserValueService } from './i-user-value-service';

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
}
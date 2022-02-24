import { ITargetValueService, IUserService } from '.';

/**
 * 用户数值服务
 */
export interface IUserValueService<T extends IUserService> extends ITargetValueService {
    readonly userService: T;
}
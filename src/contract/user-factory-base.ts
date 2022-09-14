import { ITraceable } from './i-traceable';
import { UserServiceBase } from './user-service-base';

/**
 * 用户工厂
 */
export abstract class UserFactoryBase<T extends UserServiceBase> implements ITraceable<UserFactoryBase<T>> {
    /**
     * 创建用户服务
     * 
     * @param userID 用户ID
     */
    public abstract build(userID: string): T;
    /**
     * 跟踪
     * 
     * @param parentSpan 父范围
     */
    public abstract withTrace(parentSpan: any): UserFactoryBase<T>;
}
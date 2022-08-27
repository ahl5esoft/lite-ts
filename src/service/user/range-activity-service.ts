import { UserActivityServiceBase, UserServiceBase } from '../../contract';
import { contract } from '../../model';

/**
 * 用户区间活动服务
 */
export class UserRangeActivityService<T extends contract.IRangeActivity> extends UserActivityServiceBase {
    /**
     * 关闭时间
     */
    public get closeOn() {
        return this.activity.closeOn;
    }

    /**
     * 隐藏时间
     */
    public get hideOn() {
        return this.activity.hideOn;
    }

    /**
     * 开启时间
     */
    public get openOn() {
        return this.activity.openOn;
    }

    /**
     * 
     * @param activity 活动
     * @param userService 用户服务
     */
    public constructor(
        public activity: T,
        userService: UserServiceBase,
    ) {
        super(userService);
    }
}
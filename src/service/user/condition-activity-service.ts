import { IUnitOfWork, UserActivityServiceBase, UserServiceBase } from '../../contract';
import { contract } from '../../model';

/**
 * 用户条件活动服务
 */
export class UserConditionActivityService<T extends contract.IConditionActivity> extends UserActivityServiceBase {
    /**
     * 关闭时间
     */
    public closeOn: number;
    /**
     * 隐藏时间
     */
    public hideOn: number;
    /**
     * 开始时间
     */
    public openOn: number;

    /**
     * 构造函数
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

    /**
     * 计算剩余时间
     * 
     * @param uow 工作单元
     */
    protected async initTime(uow: IUnitOfWork) {
        this.closeOn = 0;
        this.hideOn = 0;
        this.openOn = 0;

        let ok = await this.userService.valueService.checkConditions(uow, this.activity.openConditions);
        if (!ok)
            return;

        ok = await this.userService.valueService.checkConditions(uow, this.activity.closeConditions);
        if (ok)
            return;

        const beginOn = await this.userService.valueService.getCount(uow, this.activity.contrastValueType);
        this.closeOn = beginOn + this.activity.closeConditions[0][0].count;
        this.hideOn = beginOn + this.activity.hideConditions[0][0].count;
        this.openOn = beginOn + this.activity.openConditions[0][0].count;
    }
}
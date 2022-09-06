import { IUnitOfWork } from './i-unit-of-work';
import { UserServiceBase } from './user-service-base';

/**
 * 用户活动服务基类
 */
export abstract class UserActivityServiceBase {
    /**
     * 剩余时, [剩余隐藏时间, 剩余结束时间]
     */
    private m_RemainTime: [number, number];

    /**
     * 关闭时间
     */
    public abstract get closeOn(): number;
    /**
     * 隐藏时间
     */
    public abstract get hideOn(): number;
    /**
     * 开启时间
     */
    public abstract get openOn(): number;

    /**
     * 构造函数
     * 
     * @param userService 用户服务
     */
    public constructor(
        protected userService: UserServiceBase,
    ) { }

    /**
     * 获取剩余时间, [剩余隐藏时间, 剩余结束时间]
     * 
     * @param uow 工作单元
     */
    public async getRemainTime(uow: IUnitOfWork) {
        if (!this.m_RemainTime) {
            await this.initTime(uow);

            const now = await this.userService.valueService.getNow(uow);
            this.m_RemainTime = this.openOn > now ? [0, 0] : [
                this.hideOn - now < 0 ? 0 : this.hideOn - now,
                this.closeOn - now < 0 ? 0 : this.closeOn - now
            ];
        }

        return this.m_RemainTime;
    }

    /**
     * 初始化时间
     * 
     * @param _ 工作单元
     */
    protected async initTime(_: IUnitOfWork) { }
}
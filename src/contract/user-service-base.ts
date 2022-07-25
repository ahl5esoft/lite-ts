import { EnumFactoryBase } from './enum-factory-base';
import { ITargetValueService } from './i-target-value-service';
import { IUserAssociateService } from './i-user-associate-service';
import { IUserRandSeedService } from './i-user-rand-seed-service';
import { IUserRewardService } from './i-user-reward-service';
import { IUserValueService } from './i-user-value-service';
import { global } from '../model';

/**
 * 用户服务基类
 */
export abstract class UserServiceBase {
    /**
     * 随机种子区间
     */
    public static randSeedRange = {};
    /**
     * 创建随机种子服务函数
     */
    public static buildRandServiceFunc: (associateService: IUserAssociateService, scene: string, userID: string, range: [number, number]) => IUserRandSeedService;
    /**
     * 创建奖励服务函数
     */
    public static buildRewardServiceFunc: (enumFactory: EnumFactoryBase, userService: UserServiceBase) => IUserRewardService;

    /**
     * 随机种子服务
     */
    private m_RandSeedService: { [scene: string]: IUserRandSeedService } = {};

    private m_RewardService: IUserRewardService;
    /**
     * 奖励服务
     */
    public get rewardService() {
        this.m_RewardService ??= UserServiceBase.buildRewardServiceFunc(this.enumFactory, this);
        return this.m_RewardService;
    }

    /**
     * 数值服务
     */
    public abstract get valueService(): IUserValueService;

    /**
     * 构造函数
     * 
     * @param associateService 关联服务
     * @param userID 用户ID
     * @param enumFactory 枚举工厂
     */
    public constructor(
        public associateService: IUserAssociateService,
        public userID: string,
        protected enumFactory: EnumFactoryBase,
    ) { }

    /**
     * 获取随机种子服务
     * 
     * @param scene 场景, 默认: ''
     */
    public getRandSeedService(scene = '') {
        const range = UserServiceBase.randSeedRange[scene] ?? [128, 512];
        this.m_RandSeedService[scene] ??= UserServiceBase.buildRandServiceFunc(this.associateService, scene, this.userID, range);
        return this.m_RandSeedService[scene];
    }

    /**
     * 获取目标数值服务
     * 
     * @param targetType 目标类型
     */
    public abstract getTargetValueService(targetType: number): Promise<ITargetValueService<global.UserValue>>;
}
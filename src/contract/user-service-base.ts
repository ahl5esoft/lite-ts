import { DbFactoryBase } from './db-factory-base';
import { EnumFactoryBase } from './enum-factory-base';
import { ITargetValueService } from './i-target-value-service';
import { IUnitOfWork } from './i-unit-of-work';
import { IUserAssociateService } from './i-user-associate-service';
import { IUserCustomGiftBagService } from './i-user-custom-gift-bag-service';
import { IUserPortraitService } from './i-user-portrait-service';
import { IUserRandSeedService } from './i-user-rand-seed-service';
import { IUserRewardService } from './i-user-reward-service';
import { IUserValueService } from './i-user-value-service';
import { RpcBase } from './rpc-base';
import { ValueTypeServiceBase } from './value-type-service-base';
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
     * 创建自选礼包服务函数
     */
    public static buildCustomGiftBagServiceFunc: (dbFactory: DbFactoryBase, entry: global.UserCustomGiftBag) => IUserCustomGiftBagService;
    /**
     * 创建画像服务函数
     */
    public static buildPortraitServiceFunc: (rpc: RpcBase, userID: string) => IUserPortraitService;
    /**
     * 创建随机种子服务函数
     */
    public static buildRandServiceFunc: (associateService: IUserAssociateService, scene: string, userID: string, range: [number, number]) => IUserRandSeedService;
    /**
     * 创建奖励服务函数
     */
    public static buildRewardServiceFunc: (userService: UserServiceBase, valueTypeService: ValueTypeServiceBase) => IUserRewardService;

    /**
     * 自选礼包服务
     */
    private m_CustomGiftBagService: IUserCustomGiftBagService;
    /**
     * 随机种子服务
     */
    private m_RandSeedService: { [scene: string]: IUserRandSeedService } = {};

    private m_PortraitService: IUserPortraitService;
    /**
     * 画像服务
     */
    public get portraitService() {
        this.m_PortraitService ??= UserServiceBase.buildPortraitServiceFunc(this.rpc, this.userID);
        return this.m_PortraitService;
    }

    private m_RewardService: IUserRewardService;
    /**
     * 奖励服务
     */
    public get rewardService() {
        this.m_RewardService ??= UserServiceBase.buildRewardServiceFunc(this, this.valueTypeService);
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
     * @param dbFactory 数据库工厂
     * @param enumFactory 枚举工厂
     * @param rpc 远程过程调用
     * @param valueTypeService 数值类型服务
     */
    public constructor(
        public associateService: IUserAssociateService,
        public userID: string,
        protected dbFactory: DbFactoryBase,
        protected enumFactory: EnumFactoryBase,
        protected rpc: RpcBase,
        protected valueTypeService: ValueTypeServiceBase,
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
     * 获取自选礼包服务
     * 
     * @param uow 工作单元
     * @param scene 场景
     */
    public async getCustomGiftBagService(uow: IUnitOfWork, scene: string) {
        if (!this.m_CustomGiftBagService) {
            const db = this.dbFactory.db(global.UserCustomGiftBag, uow);
            const entries = await db.query().where({
                id: this.userID
            }).toArray();
            if (!entries.length) {
                entries.push({
                    giftBag: {},
                    id: this.userID
                });
                await db.add(entries[0]);
            }

            this.m_CustomGiftBagService = UserServiceBase.buildCustomGiftBagServiceFunc(this.dbFactory, entries[0]);
        }

        this.m_CustomGiftBagService.scene = scene;
        return this.m_CustomGiftBagService;
    }

    /**
     * 获取目标数值服务
     * 
     * @param targetType 目标类型
     */
    public abstract getTargetValueService(targetType: number): Promise<ITargetValueService<global.UserValue>>;
}
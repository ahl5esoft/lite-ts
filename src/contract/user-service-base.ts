import { opentracing } from 'jaeger-client';

import { DbFactoryBase } from './db-factory-base';
import { EnumFactoryBase } from './enum-factory-base';
import { IUnitOfWork } from './i-unit-of-work';
import { IUserAssociateService } from './i-user-associate-service';
import { IUserCustomGiftBagService } from './i-user-custom-gift-bag-service';
import { IUserPortraitService } from './i-user-portrait-service';
import { IUserRandSeedService } from './i-user-rand-seed-service';
import { IUserRewardService } from './i-user-reward-service';
import { IUserSecurityService } from './i-user-security-service';
import { RpcBase } from './rpc-base';
import { ThreadBase } from './thread-base';
import { UserValueServiceBase } from './user-value-service-base';
import { ValueServiceBase } from './value-service-base';
import { ValueTypeServiceBase } from './value-type-service-base';
import { global } from '../model';

export abstract class UserServiceBase {
    public static randSeedRange = {};
    public static buildCustomGiftBagServiceFunc: (dbFactory: DbFactoryBase, entry: global.UserCustomGiftBag) => IUserCustomGiftBagService;
    public static buildPortraitServiceFunc: (rpc: RpcBase, userID: string) => IUserPortraitService;
    public static buildRandServiceFunc: (associateService: IUserAssociateService, scene: string, userID: string, range: [number, number]) => IUserRandSeedService;
    public static buildRewardServiceFunc: (userService: UserServiceBase, valueTypeService: ValueTypeServiceBase) => IUserRewardService;
    public static buildSecurityServiceFunc: (rpc: RpcBase, userID: string) => IUserSecurityService;

    private m_CustomGiftBagService: IUserCustomGiftBagService;
    private m_RandSeedService: { [scene: string]: IUserRandSeedService } = {};

    private m_PortraitService: IUserPortraitService;
    public get portraitService() {
        this.m_PortraitService ??= UserServiceBase.buildPortraitServiceFunc(this.rpc, this.userID);
        return this.m_PortraitService;
    }

    private m_RewardService: IUserRewardService;
    public get rewardService() {
        this.m_RewardService ??= UserServiceBase.buildRewardServiceFunc(this, this.valueTypeService);
        return this.m_RewardService;
    }

    private m_SecurityService: IUserSecurityService;
    public get securityService() {
        this.m_SecurityService ??= UserServiceBase.buildSecurityServiceFunc(this.rpc, this.userID);
        return this.m_SecurityService;
    }

    public abstract get valueService(): UserValueServiceBase;

    public constructor(
        public associateService: IUserAssociateService,
        public userID: string,
        protected dbFactory: DbFactoryBase,
        protected enumFactory: EnumFactoryBase,
        protected rpc: RpcBase,
        protected thread: ThreadBase,
        protected valueTypeService: ValueTypeServiceBase,
        protected parentTracerSpan: opentracing.Span,
    ) { }

    public getRandSeedService(scene = '') {
        const range = UserServiceBase.randSeedRange[scene] ?? [128, 512];
        this.m_RandSeedService[scene] ??= UserServiceBase.buildRandServiceFunc(this.associateService, scene, this.userID, range);
        return this.m_RandSeedService[scene];
    }

    public async getCustomGiftBagService(uow: IUnitOfWork, scene: string) {
        if (!this.m_CustomGiftBagService) {
            const db = this.dbFactory.db(global.UserCustomGiftBag, uow);
            const entries = await db.query().toArray({
                where: {
                    id: this.userID
                }
            });
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

    public abstract getTargetValueService(targetType: number): Promise<ValueServiceBase<global.UserValue>>;
}
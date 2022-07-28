import { EnumFactoryBase, IUnitOfWork, IUserRewardService, UserServiceBase } from '../../contract';
import { contract, enum_ } from '../../model';

/**
 * 用户奖励服务
 */
export class DbUserRewardService implements IUserRewardService {
    /**
     * 构造函数
     * 
     * @param m_EnumFactory 枚举工厂
     * @param m_UserService 用户服务
     */
    public constructor(
        private m_EnumFactory: EnumFactoryBase,
        private m_UserService: UserServiceBase,
    ) { }

    /**
     * 获取结果
     * 
     * @param uow 工作单元
     * @param rewards 奖励
     * @param source 来源
     * @param scene 场景
     */
    public async findResults(uow: IUnitOfWork, rewards: contract.IReward[][], source: string, scene = '') {
        const values: contract.IValue[] = [];
        const randSeedService = this.m_UserService.getRandSeedService(scene);
        const valueTypeEnum = this.m_EnumFactory.build(enum_.ValueTypeData);
        for (const r of rewards) {
            if (!r?.length)
                continue;

            let reward: contract.IReward;
            if (r.length == 1) {
                reward = r[0];
            } else {
                const total = r.reduce((memo, cr) => {
                    return memo + cr.weight * 1;
                }, 0);
                const seed = await randSeedService.use(
                    uow,
                    total.toString().length
                );
                let rand = seed % total;
                reward = r.find(cr => {
                    rand -= cr.weight;
                    return rand <= 0;
                });
            }

            const valueTypeItem = await valueTypeEnum.getByValue(reward.valueType);
            if (valueTypeItem?.data.openRewards) {
                for (let i = 0; i < reward.count; i++) {
                    const res = await this.findResults(uow, valueTypeItem.data.openRewards, source, scene);
                    values.push(...res);
                }
            } else {
                values.push({
                    count: reward.count,
                    source: reward.source ?? source,
                    targetNo: reward.targetNo,
                    targetType: reward.targetType,
                    valueType: reward.valueType,
                });
            }
        }
        return values;
    }

    /**
     * 预览
     * 
     * @param uow 工作单元
     * @param rewards 奖励
     * @param scene 场景
     */
    public async preview(uow: IUnitOfWork, rewards: contract.IReward[][], scene = '') {
        return this.previewWithOffset(uow, rewards, 0, scene);
    }

    /**
     * 预览奖励
     * 
     * @param uow 工作单元
     * @param rewards 奖励
     * @param offset 偏移
     * @param scene 场景
     */
    private async previewWithOffset(uow: IUnitOfWork, rewards: contract.IReward[][], offset: number, scene: string) {
        const values: contract.IValue[] = [];
        const randSeedService = this.m_UserService.getRandSeedService(scene);
        const valueTypeEnum = this.m_EnumFactory.build(enum_.ValueTypeData);
        for (const r of rewards) {
            if (!r?.length)
                continue;

            let reward: contract.IReward;
            if (r.length == 1) {
                reward = r[0];
            } else {
                const total = r.reduce((memo, cr) => {
                    return memo + cr.weight * 1;
                }, 0);
                const len = total.toString().length;
                const seed = await randSeedService.get(uow, len, offset);
                offset += len;
                let rand = seed % total;
                reward = r.find(cr => {
                    rand -= cr.weight;
                    return rand <= 0;
                });
            }

            const valueTypeItem = await valueTypeEnum.getByValue(reward.valueType);
            if (valueTypeItem?.data.openRewards) {
                for (let i = 0; i < reward.count; i++) {
                    const res = await this.previewWithOffset(uow, valueTypeItem.data.openRewards, offset, scene);
                    values.push(...res);
                }
            } else {
                values.push({
                    count: reward.count,
                    valueType: reward.valueType
                });
            }
        }
        return values;
    }
}
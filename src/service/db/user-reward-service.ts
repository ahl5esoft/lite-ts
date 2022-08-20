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
        const valueTypeItems = this.m_EnumFactory.build(enum_.ValueTypeData).items;
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
                let rand = seed % total + 1;
                reward = r.find(cr => {
                    rand -= cr.weight;
                    return rand <= 0;
                });
            }

            if (valueTypeItems[reward.valueType]?.data.openRewards) {
                for (let i = 0; i < reward.count; i++) {
                    const res = await this.findResults(uow, valueTypeItems[reward.valueType].data.openRewards, source, scene);
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
     * @param rewardsGroup 奖励组
     * @param scene 场景
     */
    public async preview(uow: IUnitOfWork, rewardsGroup: { [key: string]: contract.IReward[][] }, scene = '') {
        let offset = 0;
        const res = {};
        const valueTypeItems = await this.m_EnumFactory.build(enum_.ValueTypeData).items;
        for (const [k, v] of Object.entries(rewardsGroup)) {
            const values: contract.IValue[] = [];
            const randSeedService = this.m_UserService.getRandSeedService(scene);
            let rewardsQueue = [...v];
            while (rewardsQueue.length) {
                const childRewards = rewardsQueue.pop();
                if (!childRewards?.length)
                    continue;

                let reward: contract.IReward;
                if (childRewards.length == 1) {
                    reward = childRewards[0];
                } else {
                    const total = childRewards.reduce((memo, r) => {
                        return memo + r.weight * 1;
                    }, 0);
                    const len = total.toString().length;
                    const seed = await randSeedService.get(uow, len, offset);
                    offset += len;
                    let rand = seed % total + 1;
                    reward = childRewards.find(r => {
                        rand -= r.weight;
                        return rand <= 0;
                    });
                }

                if (valueTypeItems[reward.valueType]?.data.openRewards) {
                    for (let i = 0; i < reward.count; i++)
                        rewardsQueue.splice(valueTypeItems[reward.valueType].data.openRewards.length * i, 0, ...valueTypeItems[reward.valueType].data.openRewards);
                } else {
                    values.push({
                        count: reward.count,
                        valueType: reward.valueType
                    });
                }
            }
            res[k] = values;
        }
        return res;
    }
}
import { IUnitOfWork, IUserRewardService, UserServiceBase, ValueTypeServiceBase } from '../../contract';
import { contract } from '../../model';

/**
 * 用户奖励服务
 */
export class DbUserRewardService implements IUserRewardService {
    /**
     * 构造函数
     * 
     * @param m_UserService 用户服务
     * @param m_ValueTypeService 数值类型服务
     */
    public constructor(
        private m_UserService: UserServiceBase,
        private m_ValueTypeService: ValueTypeServiceBase,
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
        const values: { [valueType: number]: contract.IValue; } = {};
        const randSeedService = this.m_UserService.getRandSeedService(scene);
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

            const openRewards = await this.findOpenRewards(uow, reward.valueType);
            if (openRewards) {
                for (let i = 0; i < reward.count; i++) {
                    const res = await this.findResults(uow, openRewards, source, scene);
                    for (const item of res) {
                        if (values[item.valueType]) {
                            values[item.valueType].count += item.count;
                        } else {
                            values[item.valueType] = {
                                count: item.count,
                                source: item.source ?? source,
                                targetNo: item.targetNo,
                                targetType: item.targetType,
                                valueType: item.valueType,
                            };
                        }
                    }
                }
            } else {
                if (values[reward.valueType]) {
                    values[reward.valueType].count += reward.count;
                } else {
                    values[reward.valueType] = {
                        count: reward.count,
                        source: reward.source ?? source,
                        targetNo: reward.targetNo,
                        targetType: reward.targetType,
                        valueType: reward.valueType,
                    };
                }
            }
        }
        return Object.values(values);
    }

    /**
     * 预览
     * 
     * @param uow 工作单元
     * @param rewardsGroup 奖励组
     * @param scene 场景
     */
    public async preview(uow: IUnitOfWork, rewardsGroup: { [key: string]: contract.IReward[][]; }, scene = '') {
        let offset = 0;
        const res = {};
        for (const [k, v] of Object.entries(rewardsGroup)) {
            const values: { [valueType: number]: contract.IValue; } = {};
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

                const openRewards = await this.findOpenRewards(uow, reward.valueType);
                if (openRewards) {
                    for (let i = 0; i < reward.count; i++)
                        rewardsQueue.splice(openRewards.length * i, 0, ...openRewards);
                } else {
                    if (values[reward.valueType]) {
                        values[reward.valueType].count += reward.count;
                    } else {
                        values[reward.valueType] = {
                            count: reward.count,
                            valueType: reward.valueType,
                        };
                    }
                }
            }
            res[k] = Object.values(values);
        }
        return res;
    }

    /**
     * 获取开启奖励
     * 
     * @param uow 工作单元
     * @param valueType 数值
     */
    private async findOpenRewards(uow: IUnitOfWork, valueType: number) {
        const allOpenReward = await this.m_ValueTypeService.get<{ [valueType: number]: contract.IReward[][]; }>('openRewards');
        if (!allOpenReward[valueType])
            return;

        const rewardAddition = await this.m_ValueTypeService.get<{
            [valueType: number]: {
                [rewardValueType: number]: number;
            };
        }>('rewardAddition');
        if (!rewardAddition[valueType])
            return allOpenReward[valueType];

        const res = [];
        for (const r of allOpenReward[valueType]) {
            if (r.length > 1) {
                const children = [];
                for (const cr of r) {
                    let weightAddition = 0;
                    if (rewardAddition[valueType][cr.valueType])
                        weightAddition = await this.m_UserService.valueService.getCount(uow, rewardAddition[valueType][cr.valueType]);
                    children.push({
                        ...cr,
                        weight: cr.weight + weightAddition
                    });
                }
                res.push(children);
            } else {
                res.push(r);
            }
        }
        return res;
    }
}
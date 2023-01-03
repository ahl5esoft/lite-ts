import { IUnitOfWork, IUserRewardService, UserServiceBase, ValueTypeServiceBase } from '../../contract';
import { contract } from '../../model';

export class DbUserRewardService implements IUserRewardService {
    public constructor(
        private m_UserService: UserServiceBase,
        private m_ValueTypeService: ValueTypeServiceBase,
    ) { }

    public async findResults(uow: IUnitOfWork, rewards: contract.IReward[][], source: string, scene = '') {
        const res = await this.findResultsWithIndex(uow, rewards, source, scene);
        return res[0];
    }

    public async findResultsWithIndex(uow: IUnitOfWork, rewards: contract.IReward[][], source: string, scene = '') {
        const res: {
            index: number,
            value: { [valueType: number]: contract.IValue; },
        } = {
            index: 0,
            value: {},
        };
        const randSeedService = this.m_UserService.getRandSeedService(scene);
        for (const r of rewards) {
            if (!r?.length)
                continue;

            let reward: contract.IReward;
            if (r.length == 1) {
                reward = r[0];
            } else {
                let total = 0;
                const toBeSortedItems: {
                    reward: contract.IReward;
                    index: number;
                    rand: number;
                }[] = [];
                for (const [index, cr] of Object.entries(r)) {
                    total += cr.weight * 1;
                    toBeSortedItems.push({
                        index: parseInt(index),
                        rand: await randSeedService.use(uow, 1),
                        reward: cr,
                    });
                }
                const seed = await randSeedService.use(
                    uow,
                    total.toString().length
                );
                let rand = seed % total + 1;
                reward = toBeSortedItems.sort((a, b) => {
                    return a.rand - b.rand;
                }).find(cr => {
                    rand -= cr.reward.weight;
                    if (rand > 0)
                        return;

                    res.index = cr.index;
                    return true;
                }).reward;
            }

            const openRewards = await this.findOpenRewards(uow, reward.valueType);
            if (openRewards) {
                for (let i = 0; i < reward.count; i++) {
                    const resRewards = await this.findResults(uow, openRewards, source, scene);
                    for (const item of resRewards) {
                        res.value[item.valueType] ??= {
                            count: 0,
                            source: item.source ?? source,
                            targetNo: item.targetNo,
                            targetType: item.targetType,
                            valueType: item.valueType,
                        };
                        res.value[item.valueType].count += item.count;
                    }
                }
            } else {
                res.value[reward.valueType] ??= {
                    count: 0,
                    source: reward.source ?? source,
                    targetNo: reward.targetNo,
                    targetType: reward.targetType,
                    valueType: reward.valueType,
                };
                res.value[reward.valueType].count += reward.count;
            }
        }

        return [
            Object.values(res.value),
            res.index
        ] as [contract.IValue[], number];
    }

    public async preview(uow: IUnitOfWork, rewardsGroup: { [key: string]: contract.IReward[][]; }, scene = '') {
        const res = await this.previewWithIndex(uow, rewardsGroup, scene);
        return Object.entries(res).reduce((memo, [k, v]) => {
            memo[k] = v[0];
            return memo;
        }, {});
    }

    public async previewWithIndex(uow: IUnitOfWork, rewardsGroup: { [key: string]: contract.IReward[][]; }, scene = '') {
        let offset = 0;
        const res: {
            [key: string]: {
                index: number,
                value: contract.IValue[],
            };
        } = {};
        for (const [k, v] of Object.entries(rewardsGroup)) {
            res[k] = {
                index: v.length == 1 ? 0 : -1,
                value: []
            };

            const randSeedService = this.m_UserService.getRandSeedService(scene);
            let rewardsQueue = [...v];
            while (rewardsQueue.length) {
                const childRewards = rewardsQueue.shift();
                if (!childRewards?.length)
                    continue;

                let reward: contract.IReward;
                if (childRewards.length == 1) {
                    reward = childRewards[0];
                } else {
                    let total = 0;
                    const toBeSortedItems: {
                        reward: contract.IReward;
                        index: number;
                        rand: number;
                    }[] = [];
                    for (const [index, r] of Object.entries(childRewards)) {
                        total += r.weight * 1;
                        toBeSortedItems.push({
                            index: parseInt(index),
                            rand: await randSeedService.get(uow, 1, offset++),
                            reward: r,
                        });
                    }
                    const len = total.toString().length;
                    const seed = await randSeedService.get(uow, len, offset);
                    offset += len;
                    let rand = seed % total + 1;
                    reward = toBeSortedItems.sort((a, b) => {
                        return a.rand - b.rand;
                    }).find((r, i) => {
                        rand -= r.reward.weight;
                        if (rand > 0)
                            return;

                        if (res[k].index == -1)
                            res[k].index = i;
                        return rand <= 0;
                    }).reward;
                }

                const openRewards = await this.findOpenRewards(uow, reward.valueType);
                if (openRewards) {
                    for (let i = 0; i < reward.count; i++)
                        rewardsQueue.splice(openRewards.length * i, 0, ...openRewards);
                } else {
                    res[k].value.push({
                        count: reward.count,
                        valueType: reward.valueType,
                    });
                }
            }
        }
        return Object.entries(res).reduce((memo, [k, v]) => {
            memo[k] = [
                v.value,
                v.index
            ];
            return memo;
        }, {});
    }

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
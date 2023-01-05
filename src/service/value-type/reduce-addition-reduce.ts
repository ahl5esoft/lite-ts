import { enum_ } from '../../model';

export function valueTypeRewardAdditionReduce(memo: enum_.ValueTypeRewardAddition, r: enum_.ValueTypeData) {
    if (r.rewardAddition) {
        memo[r.rewardAddition.valueType] ??= {};
        memo[r.rewardAddition.valueType][r.rewardAddition.rewardValueType] = r.value;
    }

    return memo;
}
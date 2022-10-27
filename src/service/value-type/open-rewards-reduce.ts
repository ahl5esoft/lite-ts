import { enum_ } from '../../model';

export function valueTypeOpenRewardsReduce(memo: enum_.ValueTypeOpenRewards, r: enum_.ValueTypeData) {
    if (r.openRewards)
        memo[r.value] = r.openRewards;

    return memo;
}
import { IReward } from '../contract';

export class ValueTypeOpenRewards {
    [valueType: number]: IReward[][];
}
import { IUnitOfWork } from './i-unit-of-work';
import { contract } from '../model';

export interface IUserRewardService {
    findResults(uow: IUnitOfWork, rewards: contract.IReward[][], source: string, scene?: string): Promise<contract.IValue[]>;
    findResultsWithIndex(uow: IUnitOfWork, rewards: contract.IReward[][], source: string, scene?: string): Promise<[contract.IValue[], number]>;
    preview(uow: IUnitOfWork, rewardsGroup: { [key: string]: contract.IReward[][] }, scene?: string): Promise<{ [key: string]: contract.IValue[] }>;
    previewWithIndex(uow: IUnitOfWork, rewardsGroup: { [key: string]: contract.IReward[][] }, scene?: string): Promise<{
        [key: string]: [contract.IValue[], number]
    }>;
}
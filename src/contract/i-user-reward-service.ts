import { IUnitOfWork } from './i-unit-of-work';
import { contract } from '../model';

/**
 * 用户奖励服务
 */
export interface IUserRewardService {
    /**
     * 获取结果
     * 
     * @param uow 工作单元
     * @param rewards 奖励
     * @param scene 场景
     */
    findResults(uow: IUnitOfWork, rewards: contract.IReward[][], scene?: string): Promise<contract.IValue[]>;
    /**
     * 预览
     * 
     * @param uow 工作单元
     * @param rewards 奖励
     * @param scene 场景
     */
    preview(uow: IUnitOfWork, rewards: contract.IReward[][], scene?: string): Promise<contract.IValue[]>;
}
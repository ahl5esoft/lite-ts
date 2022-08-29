import { IUnitOfWork } from './i-unit-of-work';

/**
 * 用户自选礼包服务
 */
export interface IUserCustomGiftBagService {
    /**
     * 场景
     */
    scene: string;
    /**
     * 自选结果, { 礼包编号: 自选编号 }
     */
    readonly custom: { [giftBagNo: number]: number };
    /**
     * 选择
     * 
     * @param uow 工作单元
     * @param giftBagNo 礼包编号
     * @param customIndex 自选编号
     */
    choose(uow: IUnitOfWork, giftBagNo: number, customIndex: number): Promise<void>;
}
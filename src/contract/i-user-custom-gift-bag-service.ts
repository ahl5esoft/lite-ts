import { IUnitOfWork } from './i-unit-of-work';

export interface IUserCustomGiftBagService {
    scene: string;
    readonly custom: { [giftBagNo: number]: number };
    choose(uow: IUnitOfWork, giftBagNo: number, customIndex: number): Promise<void>;
}
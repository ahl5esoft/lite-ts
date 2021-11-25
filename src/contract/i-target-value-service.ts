import { IUnitOfWork, IValueData } from '.';

export interface ITargetValueService {
    getCount(uow: IUnitOfWork, valueType: number): Promise<number>;
    update(uow: IUnitOfWork, ...values: IValueData[]): Promise<void>;
}
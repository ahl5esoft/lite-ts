import { IUnitOfWork, IValueConditionData, IValueData } from '.';

export interface ITargetValueService {
    checkConditions(uow: IUnitOfWork, conditions: IValueConditionData[]): Promise<boolean>;
    enough(uow: IUnitOfWork, values: IValueData[]): Promise<boolean>;
    getCount(uow: IUnitOfWork, valueType: number): Promise<number>;
    update(uow: IUnitOfWork, values: IValueData[]): Promise<void>;
}
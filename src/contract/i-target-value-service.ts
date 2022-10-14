import { IUnitOfWork } from './i-unit-of-work';
import { contract, global } from '../model';

export interface ITargetValueService<T extends global.UserValue> {
    readonly entry: Promise<T>;
    readonly updateValues: contract.IValue[];
    checkConditions(uow: IUnitOfWork, conditions: contract.IValueCondition[][]): Promise<boolean>;
    getCount(uow: IUnitOfWork, valueType: number): Promise<number>;
    update(uow: IUnitOfWork, values: contract.IValue[]): Promise<void>;
}
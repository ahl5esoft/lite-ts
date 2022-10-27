import { IUnitOfWork } from './i-unit-of-work';

export interface IDbOption {
    model: Function;
    uow?: IUnitOfWork;
}
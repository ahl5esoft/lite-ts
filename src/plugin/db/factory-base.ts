import { RepositoryBase } from './repository-base';
import { IUnitOfWork } from './unit-of-work-base';

export abstract class FactoryBase {
    public abstract db<T>(model: Function, ...extra: DbExtraType[]): RepositoryBase<T>;
    public abstract uow(): IUnitOfWork;
}

export type DbExtraType = IUnitOfWork;
import { DbRepositoryBase } from './repository-base';
import { IUnitOfWork } from './unit-of-work-base';

export abstract class DbFactoryBase {
    public abstract db<T>(model: Function, ...extra: DbExtraType[]): DbRepositoryBase<T>;
    public abstract uow(): IUnitOfWork;
}

export type DbExtraType = IUnitOfWork;
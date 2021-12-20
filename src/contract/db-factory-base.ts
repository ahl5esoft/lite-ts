import { DbRepositoryBase } from './db-repository-base';
import { IUnitOfWork } from './i-unit-of-work';

export abstract class DbFactoryBase {
    public abstract db<T>(model: new () => T, ...extra: any[]): DbRepositoryBase<T>;
    public abstract uow(): IUnitOfWork;
}

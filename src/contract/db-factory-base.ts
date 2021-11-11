import { DbRepositoryBase } from './db-repository-base';
import { IUnitOfWork } from './i-unit-of-work';

export abstract class DbFactoryBase {
    public abstract close(): Promise<void>;
    public abstract db<T>(model: new () => T, uow?: IUnitOfWork): DbRepositoryBase<T>;
    public abstract uow(): IUnitOfWork;
}

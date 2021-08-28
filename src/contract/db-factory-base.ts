import { DBRepositoryBase } from './db-repository-base';
import { IUnitOfWork } from './i-unit-of-work';

export abstract class DBFactoryBase {
    public abstract close(): Promise<void>;
    public abstract db<T>(model: new () => T, uow?: IUnitOfWork): DBRepositoryBase<T>;
    public abstract uow(): IUnitOfWork;
}

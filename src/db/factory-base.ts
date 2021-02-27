import { DBRepositoryBase } from './repository-base';
import { UnitOfWorkBase } from './unit-of-work-base';

export abstract class DBFactoryBase {
    public abstract db<T>(model: Function, ...extra: any[]): DBRepositoryBase<T>;
    public abstract uow(): UnitOfWorkBase;
}

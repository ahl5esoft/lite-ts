import { EnumBase } from './enum-base';
import { IUnitOfWork } from './i-unit-of-work';
import { ValueServiceBase } from './value-service-base';
import { enum_, global } from '../model';

export abstract class EnumFactoryBase {
    public abstract build<T extends enum_.ItemData>(model: new () => T): EnumBase<T>;
    public abstract buildWithAb<T extends enum_.ItemData>(
        uow: IUnitOfWork,
        userValueService: ValueServiceBase<global.UserValue>,
        typer: new () => T,
    ): Promise<EnumBase<T>>;
}
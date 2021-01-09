import { DbQueryBase } from './query-base';
import { UnitOfWorkBase } from './unit-of-work-base';

export abstract class DbRepositoryBase<T> {
    public constructor(protected table: string, private m_IsTx: boolean, private m_Uow: UnitOfWorkBase) { }

    public async add(entry: T): Promise<void> {
        this.m_Uow.registerAdd(this.table, entry);
        if (this.m_IsTx)
            return;

        await this.m_Uow.commit();
    }

    public async remove(entry: T): Promise<void> {
        this.m_Uow.registerRemove(this.table, entry);
        if (this.m_IsTx)
            return;

        await this.m_Uow.commit();
    }

    public async save(entry: T): Promise<void> {
        this.m_Uow.registerSave(this.table, entry);
        if (this.m_IsTx)
            return;

        await this.m_Uow.commit();
    }

    public abstract query(): DbQueryBase<T>;
}

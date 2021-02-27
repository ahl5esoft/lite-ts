import { DBQueryBase } from './query-base';
import { UnitOfWorkBase } from './unit-of-work-base';

export abstract class DBRepositoryBase<T> {
    public constructor(
        protected tableName: string,
        private m_IsTx: boolean,
        private m_Uow: UnitOfWorkBase
    ) { }

    public async add(entry: T): Promise<void> {
        await this.exec('Add', entry);
    }

    public async remove(entry: T): Promise<void> {
        await this.exec('Remove', entry);
    }

    public async save(entry: T): Promise<void> {
        await this.exec('Save', entry);
    }

    public abstract query(): DBQueryBase<T>;

    private async exec(action: string, entry: any): Promise<void> {
        this.m_Uow[`register${action}`](this.tableName, entry);
        if (this.m_IsTx)
            return;

        await this.m_Uow.commit();
    }
}

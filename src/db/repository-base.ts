import { DBFactoryBase } from './factory-base';
import { DBQueryBase } from './query-base';
import { UnitOfWorkBase } from './unit-of-work-base';

export abstract class DBRepositoryBase<T> {
    private m_IsTx = true;

    protected get uow(): UnitOfWorkBase {
        if (!this.m_Uow) {
            this.m_Uow = this.m_DBFactory.uow();
            this.m_IsTx = false;
        }

        return this.m_Uow;
    }

    public constructor(
        protected tableName: string,
        private m_DBFactory: DBFactoryBase,
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
        this.uow[`register${action}`](this.tableName, entry);
        if (this.m_IsTx)
            return;

        await this.uow.commit();
    }
}

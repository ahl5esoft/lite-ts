import { DBFactoryBase } from './db-factory-base';
import { IDBQuery } from './i-db-query';
import { IUnitOfWorkRepository } from './i-unit-of-work-repository';

type regiterAction = (table: string, entry: any) => void;

export abstract class DBRepositoryBase<T> {
    private m_IsTx = true;

    protected get uow(): IUnitOfWorkRepository {
        if (!this.m_Uow) {
            this.m_Uow = this.m_DBFactory.uow() as IUnitOfWorkRepository;
            this.m_IsTx = false;
        }

        return this.m_Uow;
    }

    public constructor(
        protected tableName: string,
        private m_DBFactory: DBFactoryBase,
        private m_Uow: IUnitOfWorkRepository
    ) { }

    public async add(entry: T): Promise<void> {
        await this.exec(this.uow.registerAdd, entry);
    }

    public async remove(entry: T): Promise<void> {
        await this.exec(this.uow.registerRemove, entry);
    }

    public async save(entry: T): Promise<void> {
        await this.exec(this.uow.registerSave, entry);
    }

    public abstract query(): IDBQuery<T>;

    private async exec(action: regiterAction, entry: any): Promise<void> {
        action.bind(this.uow)(this.tableName, entry);
        if (this.m_IsTx)
            return;

        await this.uow.commit();
    }
}

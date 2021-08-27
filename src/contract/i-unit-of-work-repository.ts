import { IUnitOfWork } from './i-unit-of-work';

export interface IUnitOfWorkRepository extends IUnitOfWork {
    registerAdd(table: string, entry: any): void;
    registerRemove(table: string, entry: any): void;
    registerSave(table: string, entry: any): void;
}
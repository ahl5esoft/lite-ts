import { IDbQueryOption } from './i-db-query-option';

export interface IDbQuery<T> {
    count(where?: any): Promise<number>;
    toArray(v?: Partial<IDbQueryOption<any>>): Promise<T[]>;
}

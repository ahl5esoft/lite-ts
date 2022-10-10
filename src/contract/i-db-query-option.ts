export interface IDbQueryOption<T> {
    skip: number;
    take: number;
    where: T;
    order: string[];
    orderByDesc: string[];
}
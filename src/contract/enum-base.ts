import { IEnumItem } from './i-enum-item';
import { enum_ } from '../model';

export abstract class EnumBase<T extends enum_.ItemData> {
    public get items() {
        return new Promise<IEnumItem<T>[]>(async (s, f) => {
            try {
                const allItem = await this.allItem;
                s(
                    Object.values(allItem)
                );
            } catch (ex) {
                f(ex);
            }
        });
    }

    public abstract get allItem(): Promise<{ [value: number]: IEnumItem<T> }>;

    public constructor(
        protected typer: new () => T,
        private m_GetReduceFunc: (key: string, name: string) => Promise<any>,
    ) { }

    public async get(predicate: (entry: T) => boolean) {
        const items = await this.items;
        return items.find(r => {
            return predicate(r.entry);
        });
    }

    public async getReduce<TReduce>(typer: new () => TReduce) {
        return this.m_GetReduceFunc(typer.name, this.typer.name);
    }
}
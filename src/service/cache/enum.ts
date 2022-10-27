import { CacheBase, IEnum, IEnumItem } from '../../contract';
import { contract } from '../../model';

export class CacheEnum<T extends contract.IEnumItem> implements IEnum<T> {
    private m_ReduceCahce = {};
    private m_UpdateOn = 0;

    public get allItem() {
        return new Promise<{ [value: number]: IEnumItem<T> }>(async (s, f) => {
            try {
                const res = await this.m_Cache.get<{ [value: number]: IEnumItem<T> }>(this.m_Name);
                s(res ?? {});
            } catch (ex) {
                f(ex);
            }
        });
    }

    public get items() {
        return new Promise<IEnumItem<T>[]>(async (s, f) => {
            try {
                const res = await this.allItem;
                s(
                    Object.values(res)
                );
            } catch (ex) {
                f(ex);
            }
        });
    }

    public constructor(
        private m_Cache: CacheBase,
        private m_Name: string,
        private m_ReduceFunc: { [key: string]: (memo: any, item: T) => any } = {},
    ) { }

    public async get(predicate: (data: T) => boolean) {
        const items = await this.items;
        return items.find(r => {
            return predicate(r.data);
        });
    }

    public async getReduce<TReduce>(typer: new () => TReduce) {
        if (this.m_UpdateOn != 0 && this.m_UpdateOn == this.m_Cache.updateOn)
            return this.m_ReduceCahce[typer.name] as TReduce;

        this.m_UpdateOn = this.m_Cache.updateOn;
        this.m_ReduceCahce = {};

        const items = await this.items;
        for (const r of items) {
            for (const [k, v] of Object.entries(this.m_ReduceFunc)) {
                this.m_ReduceCahce[k] ??= {};
                this.m_ReduceCahce[k] = v(this.m_ReduceCahce[k], r.data as T);
            }
        }

        return this.m_ReduceCahce[typer.name] as TReduce;
    }
}
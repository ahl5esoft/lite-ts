import { CacheBase, EnumBase, IEnumItem } from '../../contract';
import { contract } from '../../model';

export class CacheEnum<T extends contract.IEnumItem> extends EnumBase<T> {
    private m_ReduceCahce = {};
    private m_UpdateOn = 0;

    public get allItem() {
        return new Promise<{ [value: number]: IEnumItem<T> }>(async (s, f) => {
            try {
                const res = await this.m_Cache.get<{ [value: number]: IEnumItem<T> }>(this.typer.name);
                s(res ?? {});
            } catch (ex) {
                f(ex);
            }
        });
    }

    public constructor(
        private m_Cache: CacheBase,
        typer: new () => T,
        reduceFunc: { [key: string]: (memo: any, item: T) => any } = {},
    ) {
        super(typer, async key => {
            if (this.m_UpdateOn != 0 && this.m_UpdateOn == this.m_Cache.updateOn)
                return this.m_ReduceCahce[key];

            this.m_UpdateOn = this.m_Cache.updateOn;
            this.m_ReduceCahce = {};

            const items = await this.items;
            for (const r of items) {
                Object.entries(reduceFunc).forEach(([k, v]) => {
                    this.m_ReduceCahce[k] ??= {};
                    this.m_ReduceCahce[k] = v(this.m_ReduceCahce[k], r.entry as T);
                });
            }

            return this.m_ReduceCahce[key];
        });
    }

    public async get(predicate: (data: T) => boolean) {
        const items = await this.items;
        return items.find(r => {
            return predicate(r.entry);
        });
    }
}
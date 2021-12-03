import { IAssociateStorageService } from '../..';

export class CacheAssociateStorageService implements IAssociateStorageService {
    private m_Associates: { [key: string]: any } = {};

    public constructor(
        private m_FindFuncs: { [key: string]: () => Promise<any> }
    ) { }

    public add<T>(model: new () => T, entry: T) {
        if (!(model.name in this.m_Associates))
            this.m_Associates[model.name] = [];

        this.m_Associates[model.name].push(entry);
    }

    public clear<T>(model: new () => T, filterFunc: (r: T) => boolean) {
        if (model.name in this.m_Associates) {
            this.m_Associates[model.name] = (this.m_Associates[model.name] as T[]).filter(r => {
                return !filterFunc(r);
            });
        }
    }

    public async find<T>(model: new () => T, filterFunc: (r: T) => boolean) {
        const findFunc = this.m_FindFuncs[model.name];
        if (!findFunc)
            throw new Error(`缺少获取函数: ${model.name}`);

        if (!this.m_Associates[model.name])
            this.m_Associates[model.name] = await findFunc();

        return (this.m_Associates[model.name] as T[]).filter(filterFunc);
    }
}
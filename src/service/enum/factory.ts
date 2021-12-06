import { EnumFacatoryBase, IEnumItemData } from '../..';

export class EnumFactory extends EnumFacatoryBase {
    public constructor(
        private m_BuildFuncs: { [key: string]: () => any }
    ) {
        super();
    }

    public build<T extends IEnumItemData>(model: new () => T) {
        if (model.name in this.m_BuildFuncs)
            return this.m_BuildFuncs[model.name]();

        throw new Error(`缺少创建函数: ${model.name}`);
    }
}
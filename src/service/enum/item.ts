import { IEnumItem, IEnumItemData } from '../..';

export class EnumItem<T extends IEnumItemData> implements IEnumItem<T> {
    private m_EncodingKey: string;
    public get encodingKey() {
        return this.m_EncodingKey;
    }

    public constructor(
        public data: T,
        private m_Name: string
    ) {
        this.m_EncodingKey = `${m_Name}_${data.value}`;
    }

    public getCustomEncodingKey(attr: string) {
        return `${this.m_Name}_${this.data.value}_${attr}`;
    }
}
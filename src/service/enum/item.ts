import { IEnumItem, IEnumItemData } from '../..';

export class EnumItem<T extends IEnumItemData> implements IEnumItem<T> {
    private m_EncodingKey: string;
    public get encodingKey() {
        return this.m_EncodingKey;
    }

    public constructor(
        public data: T,
        private m_Name: string,
        private m_Sep?: string,
    ) {
        if (!this.m_Sep)
            this.m_Sep = '_';

        this.m_EncodingKey = this.join(this.m_Name, data.value);
    }

    public getCustomEncodingKey(attr: string) {
        return this.join(this.m_Name, this.data.value, attr);
    }

    private join(...keys: any[]) {
        return keys.join(this.m_Sep);
    }
}
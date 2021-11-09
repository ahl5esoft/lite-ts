import { IEnumItem } from '../..';
import { global } from '../../model';

export class EnumItem implements IEnumItem {
    private m_EncodingKey: string;
    public get encodingKey() {
        return this.m_EncodingKey;
    }

    public constructor(
        public data: global.IEnumItemData,
        private m_Name: string
    ) {
        this.m_EncodingKey = `enum-${m_Name}-${data.value}`;
    }

    public getCustomEncodingKey(attr: string) {
        return `enum-${this.m_Name}-${attr}-${this.data.value}`;
    }
}
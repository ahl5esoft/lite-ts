import { IEnumItem, IEnumItemData } from '../..';

/**
 * 枚举项
 */
export class EnumItem<T extends IEnumItemData> implements IEnumItem<T> {
    private m_EncodingKey: string;
    /**
     * 默认多语言键, 格式: 枚举名{分隔符}枚举值
     */
    public get encodingKey() {
        return this.m_EncodingKey;
    }

    /**
     * 构造函数
     * 
     * @param data 枚举项数据
     * @param m_Name 枚举名
     * @param m_Sep 多语言格式分隔符
     */
    public constructor(
        public data: T,
        private m_Name: string,
        private m_Sep: string,
    ) {
        this.m_EncodingKey = this.join(this.m_Name, data.value);
    }

    /**
     * 获取自定义多语言键
     * 
     * @param attr 特性
     * 
     * @returns 枚举名{分隔符}枚举值{分隔符}特性
     */
    public getCustomEncodingKey(attr: string) {
        return this.join(this.m_Name, this.data.value, attr);
    }

    /**
     * 拼接出多语言键
     * 
     * @param keys 键
     */
    private join(...keys: any[]) {
        return keys.join(this.m_Sep);
    }
}
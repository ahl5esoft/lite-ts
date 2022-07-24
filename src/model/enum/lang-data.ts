import { IEnumItem } from '../contract';

/**
 * 语言枚举模型
 */
export class LangData implements IEnumItem {
    /**
     * 枚举键, 例如: en
     */
    public key: string;
    /**
     * 内容, { 多语言键: 文本 }
     */
    public properties: { [key: string]: string };
    /**
     * 枚举值
     */
    public value: number;
}
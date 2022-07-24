import { IEnumItem } from '../contract';

/**
 * 目标类型枚举
 */
export class TargetTypeData implements IEnumItem {
    /**
     * 应用名
     */
    public app: string;
    /**
     * 键
     */
    public key: string;
    /**
     * 值
     */
    public value: number;
}
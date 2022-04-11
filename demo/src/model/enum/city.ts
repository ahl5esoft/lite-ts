import { IEnumItemData } from '../../../../src';

/**
 * 城市
 */
export class CityData implements IEnumItemData {
    /**
     * 英文名
     */
    public key: string;
    /**
     * 城市编号
     */
    public value: number;
}
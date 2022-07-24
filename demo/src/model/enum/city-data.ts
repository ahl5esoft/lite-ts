import { contract } from '../../../../src/model';

/**
 * 城市
 */
export class CityData implements contract.IEnumItem {
    /**
     * 英文名
     */
    public key: string;
    /**
     * 城市编号
     */
    public value: number;
}
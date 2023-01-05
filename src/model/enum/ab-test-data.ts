import { ItemData } from './item-data';
import { IValueCondition } from '../contract';

export class AbTestData extends ItemData {
    public enumName: string;
    public conditions: IValueCondition[][];
}
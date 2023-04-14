import { Integer } from '../../contract';

export interface IValue {
    count: Integer;
    valueType: number;
    isSkipIntercept?: boolean;
    source?: string;
    targetNo?: number;
    targetType?: number;
}
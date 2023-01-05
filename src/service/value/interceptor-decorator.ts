import { valueInterceptorMetadata } from './interceptor-metadata';
import { IValueInterceptor } from '../../contract';
import { enum_ } from '../../model';

export function ValueIntercept(valueType: number): (ctor: new () => IValueInterceptor) => void;
export function ValueIntercept(predicate: (entry: enum_.ValueTypeData) => boolean | Promise<boolean>): (ctor: new () => IValueInterceptor) => void;
export function ValueIntercept(any: number | ((entry: enum_.ValueTypeData) => boolean | Promise<boolean>)) {
    return (ctor: new () => IValueInterceptor) => {
        if (typeof any == 'number') {
            valueInterceptorMetadata.valueType[any] = ctor;
        }
        else {
            valueInterceptorMetadata.predicates.push({
                ctor,
                predicate: any,
            });
        }
    };
}

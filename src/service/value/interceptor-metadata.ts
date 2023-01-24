import { ValueSyncValueInterceptor } from './sync-value-interceptor';
import { IValueInterceptor } from '../../contract';
import { enum_ } from '../../model';

export const valueInterceptorMetadata: {
    predicates: {
        ctor: new () => IValueInterceptor,
        predicate: (valueType: enum_.ValueTypeData) => boolean | Promise<boolean>
    }[],
    valueType: { [valueType: number]: new () => IValueInterceptor }
} = {
    predicates: [{
        ctor: ValueSyncValueInterceptor,
        predicate(valueType) {
            return !!valueType.sync?.valueTypes?.length;
        },
    }],
    valueType: {}
}
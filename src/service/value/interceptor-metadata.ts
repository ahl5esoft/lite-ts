import { IValueInterceptor } from '../../contract';
import { enum_ } from '../../model';

export const valueInterceptorMetadata = {
    predicates: [] as {
        ctor: new () => IValueInterceptor,
        predicate: (valueType: enum_.ValueTypeData) => boolean
    }[],
    valueType: {} as { [valueType: number]: new () => IValueInterceptor }
}
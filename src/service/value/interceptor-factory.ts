import Container from 'typedi';

import { IValueInterceptor, ValueInterceptorFactoryBase } from '../..';

const nullValueInterceptor: IValueInterceptor = {
    after: async () => { },
    before: async () => {
        return false;
    }
};
const valueInterceptorCtors: { [key: number]: { [key: number]: new () => IValueInterceptor } } = {};

export class ValueInterceptorFactory extends ValueInterceptorFactoryBase {
    public build(targetType: number, valueType: number): IValueInterceptor {
        const valueTypeCtors = valueInterceptorCtors[targetType];
        if (valueTypeCtors) {
            const ctor = valueTypeCtors[valueType];
            if (ctor)
                return Container.get(ctor);
        }

        return nullValueInterceptor;
    }

    public static register(targetType: number, valueType: number, ctor: new () => IValueInterceptor) {
        if (!(targetType in valueInterceptorCtors))
            valueInterceptorCtors[targetType] = {};

        valueInterceptorCtors[targetType][valueType] = ctor;
    }
}
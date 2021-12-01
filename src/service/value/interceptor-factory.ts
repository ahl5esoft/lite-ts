import Container from 'typedi';

import { IValueInterceptorService, ValueInterceptorFactoryBase } from '../..';

const nullValueInterceptorService: IValueInterceptorService = {
    after: async () => { },
    before: async () => {
        return false;
    }
};
const valueInterceptorCtors: { [key: number]: { [key: number]: new () => IValueInterceptorService } } = {};

export class ValueInterceptorFactory extends ValueInterceptorFactoryBase {
    public build(targetType: number, valueType: number): IValueInterceptorService {
        const valueTypeCtors = valueInterceptorCtors[targetType];
        if (valueTypeCtors) {
            const ctor = valueTypeCtors[valueType];
            if (ctor)
                return Container.get(ctor);
        }

        return nullValueInterceptorService;
    }

    public static register(targetType: number, valueType: number, ctor: new () => IValueInterceptorService) {
        if (!(targetType in valueInterceptorCtors[targetType]))
            valueInterceptorCtors[targetType] = {};

        valueInterceptorCtors[targetType][valueType] = ctor;
    }
}
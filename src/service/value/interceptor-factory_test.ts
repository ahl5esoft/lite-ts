import { strictEqual } from 'assert';

import { ValueIntercept } from './interceptor-decorator';
import { ValueInterceptorFactory as Self } from './interceptor-factory';
import { valueInterceptorMetadata } from './interceptor-metadata';
import { NullValueInterceptor } from './null-interceptor';
import { Mock } from '../assert';
import { EnumBase, EnumFactoryBase, IValueInterceptor } from '../../contract';
import { contract, enum_ } from '../../model';

@ValueIntercept((entry: enum_.ValueTypeData) => {
    return entry.value == 10;
})
class PredicateValueInterceptor implements IValueInterceptor {
    public async after() { }

    public async before() {
        return false;
    }
}

@ValueIntercept(1)
class ValueTypeValueInterceptor implements IValueInterceptor {
    public async after() { }

    public async before() {
        return false;
    }
}

describe('src/service/value/interceptor-factory.ts', () => {
    describe('.build(valueType: number)', () => {
        it('predicate', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, null);

            const mockEnum = new Mock<EnumBase<enum_.ValueTypeData>>({
                allItem: {
                    10: {
                        entry: {
                            value: 10
                        }
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            const res = await self.build({
                valueType: 10
            } as contract.IValue);
            strictEqual(res.constructor, PredicateValueInterceptor);
            strictEqual(valueInterceptorMetadata.valueType[10], PredicateValueInterceptor);
        });

        it('valueType', async () => {
            const res = await new Self(null, null).build({
                valueType: 1
            } as contract.IValue);
            strictEqual(res.constructor, ValueTypeValueInterceptor);
        });

        it('skip', async () => {
            const res = await new Self(null, null).build({
                isSkipIntercept: true,
                valueType: 1,
            } as contract.IValue);
            strictEqual(res.constructor, NullValueInterceptor);
        });
    });
});
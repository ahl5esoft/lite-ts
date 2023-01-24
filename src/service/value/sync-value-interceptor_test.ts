import { Mock } from 'lite-ts-mock';

import { ValueSyncValueInterceptor as Self } from './sync-value-interceptor';
import { EnumBase, EnumFactoryBase, ValueServiceBase } from '../../contract';
import { enum_, global } from '../../model';

describe('src/service/value/sync-value-interceptor.ts', () => {
    describe('.after(uow: IUnitOfWork, valueService: ValueServiceBase<global.UserValue>, changeValue: contract.IValue)', () => {
        it('ok', async () => {
            const self = new Self();

            const mockEnumFactory = new Mock<EnumFactoryBase>();
            self.enumFactory = mockEnumFactory.actual;

            const mockEnum = new Mock<EnumBase<enum_.ValueTypeData>>({
                allItem: {
                    2: {
                        entry: {
                            sync: {
                                valueTypes: [3, 4]
                            }
                        } as enum_.ValueTypeData
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            const mockValueService = new Mock<ValueServiceBase<global.UserValue>>();
            mockValueService.expected.update(null, [{
                count: 1,
                source: 'test',
                valueType: 3
            }, {
                count: 1,
                source: 'test',
                valueType: 4
            }]);

            await self.after(null, mockValueService.actual, {
                count: 1,
                source: 'test',
                valueType: 2
            });
        });
    });
});
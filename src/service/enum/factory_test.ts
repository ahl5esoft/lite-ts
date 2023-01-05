import { strictEqual } from 'assert';

import { EnumFactory as Self } from './factory';
import { Mock, mockAny } from '../assert';
import { EnumBase, ValueServiceBase } from '../../contract';
import { enum_, global } from '../../model';

describe('src/service/enum/factory.ts', () => {
    describe(`.buildWithAb<T extends enum_.ItemData>(
        uow: IUnitOfWork,
        userValueService: ValueServiceBase<global.UserValue>,
        typer: new () => T,
    )`, () => {
        it('ab', async () => {
            const mockEnum = new Mock<EnumBase<enum_.ItemData>>();
            const self = new Self(null, {
                [enum_.ItemData.name]: mockEnum.actual
            }, null);

            const mockAbEnum = new Mock<EnumBase<enum_.AbTestData>>();
            Reflect.set(self, 'build', (arg: any) => {
                strictEqual(arg, enum_.AbTestData);
                return mockAbEnum.actual;
            });

            mockAbEnum.expectReturn(
                r => r.get(mockAny),
                {
                    entry: {
                        conditions: []
                    } as enum_.AbTestData
                }
            );

            const mockUserValueService = new Mock<ValueServiceBase<global.UserValue>>();
            mockUserValueService.expectReturn(
                r => r.checkConditions(null, []),
                true
            );

            const res = await self.buildWithAb(null, mockUserValueService.actual, enum_.ItemData);
            strictEqual(res, mockEnum.actual);
        });
    });
});
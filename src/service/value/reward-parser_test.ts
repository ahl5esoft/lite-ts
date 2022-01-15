import { deepStrictEqual } from 'assert';

import { ValueRewardParser as Self } from './reward-parser';
import { Mock, mockAny } from '..';
import { EnumFacatoryBase, IEnum, IEnumItem } from '../..';

class ValueTypeData {
    public text: string;
    public value: number;
}

describe('src/service/value/consume-parser.ts', () => {
    describe('.parse(text: string)', () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<EnumFacatoryBase>();
            const self = new Self(mockEnumFactory.actual, ValueTypeData);

            const mockEnum = new Mock<IEnum<ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(ValueTypeData),
                mockEnum.actual
            );

            const mockAItem = new Mock<IEnumItem<ValueTypeData>>({
                data: {
                    text: 'A',
                    value: 11
                }
            });
            mockEnum.expectReturn(
                r => r.get(mockAny),
                mockAItem.actual
            );
            mockEnum.expectReturn(
                r => r.get(mockAny),
                mockAItem.actual
            );

            const mockBItem = new Mock<IEnumItem<ValueTypeData>>({
                data: {
                    text: 'B',
                    value: 22
                }
            });
            mockEnum.expectReturn(
                r => r.get(mockAny),
                mockBItem.actual
            );

            const res = await self.parse(`A*-1

A*2*99
B*3*1`);
            deepStrictEqual(res, [
                [{
                    count: -1,
                    valueType: 11,
                    weight: 0
                }],
                [{
                    count: 2,
                    valueType: 11,
                    weight: 99
                }, {
                    count: 3,
                    valueType: 22,
                    weight: 1
                }]
            ]);
        });
    });
});
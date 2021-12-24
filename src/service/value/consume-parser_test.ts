import { deepStrictEqual } from 'assert';

import { ValueConsumeParser as Self } from './consume-parser';
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
            const self = new Self(mockEnumFactory.actual, /^(.+)\*-(\d+)$/, ValueTypeData);

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

            const res = await self.parse(`
A*-15
B*-5`);
            deepStrictEqual(res, [{
                count: -15,
                valueType: 11,
            }, {
                count: -5,
                valueType: 22,
            }]);
        });
    });
});
import { deepStrictEqual } from 'assert';

import { ValueConditionParser as Self } from './condition-parser';
import { Mock, mockAny } from '..';
import { EnumFacatoryBase, IEnum, IEnumItem, model } from '../..';

class ValueTypeData {
    public text: string;
    public value: number;
}

describe('src/service/value/condition-parser.ts', () => {
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

            const res = await self.parse(`A=-15
B>=-5`);
            deepStrictEqual(res, [{
                count: -15,
                op: model.enum_.RelationOperator.eq,
                valueType: 11,
            }, {
                count: -5,
                op: model.enum_.RelationOperator.ge,
                valueType: 22,
            }]);
        });
    });
});
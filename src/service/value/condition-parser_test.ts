import { deepStrictEqual } from 'assert';

import { ValueConditionParser as Self } from './condition-parser';
import { Mock, mockAny } from '../assert';
import { EnumFactoryBase, IReadonlyEnum, model } from '../..';
import { enum_ } from '../../model';

describe('src/service/value/condition-parser.ts', () => {
    describe('.parse(text: string)', () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, enum_.ValueTypeData);

            const mockEnum = new Mock<IReadonlyEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            const itemA = {
                text: 'A',
                value: 11
            };
            mockEnum.expectReturn(
                r => r.get(mockAny),
                {
                    data: itemA
                }
            );

            const itemB = {
                text: 'B',
                value: 22
            };
            mockEnum.expectReturn(
                r => r.get(mockAny),
                {
                    data: itemB
                }
            );

            const itemC = {
                text: 'C',
                value: 33
            };
            mockEnum.expectReturn(
                r => r.get(mockAny),
                {
                    data: itemC
                }
            );

            const itemD = {
                text: 'D',
                value: 44
            };
            mockEnum.expectReturn(
                r => r.get(mockAny),
                {
                    data: itemD
                }
            );

            const res = await self.parse(`A=-15
B>=-5

C<=20
D>=0.99`);
            deepStrictEqual(res, [
                [{
                    count: -15,
                    op: model.enum_.RelationOperator.eq,
                    valueType: 11,
                }, {
                    count: -5,
                    op: model.enum_.RelationOperator.ge,
                    valueType: 22,
                }],
                [{
                    count: 20,
                    op: model.enum_.RelationOperator.le,
                    valueType: 33,
                }, {
                    count: 0.99,
                    op: model.enum_.RelationOperator.ge,
                    valueType: 44,
                }]
            ]);
        });
    });
});
import { deepStrictEqual } from 'assert';
import { Mock, mockAny } from 'lite-ts-mock';

import { ValueConditionParser as Self } from './condition-parser';
import { EnumBase, EnumFactoryBase } from '../../contract';
import { enum_ } from '../../model';

describe('src/service/value/condition-parser.ts', () => {
    describe('.parse(text: string)', () => {
        it(enum_.RelationOperator.nowDiff, async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual);

            const mockEnum = new Mock<EnumBase<enum_.ValueTypeData>>();
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
                    entry: itemA
                }
            );

            const res = await self.parse(`A${enum_.RelationOperator.nowDiff}${enum_.RelationOperator.le}55`);
            deepStrictEqual(res, [
                [{
                    count: 55,
                    op: enum_.RelationOperator.nowDiff + enum_.RelationOperator.le,
                    valueType: 11
                }]
            ]);
        });

        it(enum_.RelationOperator.mod, async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual);

            const mockEnum = new Mock<EnumBase<enum_.ValueTypeData>>();
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
                    entry: itemA
                }
            );

            const res = await self.parse(`A${enum_.RelationOperator.mod}${enum_.RelationOperator.gt}55`);
            deepStrictEqual(res, [
                [{
                    count: 55,
                    op: enum_.RelationOperator.mod + enum_.RelationOperator.gt,
                    valueType: 11
                }]
            ]);
        });

        it('ok', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual);

            const mockEnum = new Mock<EnumBase<enum_.ValueTypeData>>();
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
                    entry: itemA
                }
            );

            const itemB = {
                text: 'B',
                value: 22
            };
            mockEnum.expectReturn(
                r => r.get(mockAny),
                {
                    entry: itemB
                }
            );

            const itemC = {
                text: 'C',
                value: 33
            };
            mockEnum.expectReturn(
                r => r.get(mockAny),
                {
                    entry: itemC
                }
            );

            const itemD = {
                text: 'D',
                value: 44
            };
            mockEnum.expectReturn(
                r => r.get(mockAny),
                {
                    entry: itemD
                }
            );

            const res = await self.parse(`A=-15
B>=-5

C<=20
D>=0.99`);
            deepStrictEqual(res, [
                [{
                    count: -15,
                    op: enum_.RelationOperator.eq,
                    valueType: 11,
                }, {
                    count: -5,
                    op: enum_.RelationOperator.ge,
                    valueType: 22,
                }],
                [{
                    count: 20,
                    op: enum_.RelationOperator.le,
                    valueType: 33,
                }, {
                    count: 0.99,
                    op: enum_.RelationOperator.ge,
                    valueType: 44,
                }]
            ]);
        });
    });
});
import { deepStrictEqual } from 'assert';

import { ValueDataParser as Self } from './data-parser';
import { Mock, mockAny } from '../assert';
import { EnumFactoryBase, IReadonlyEnum, IEnumItem } from '../..';
import { enum_ } from '../../model';


describe('src/service/value/data-parser.ts', () => {
    describe('.parse(text: string)', () => {
        it('增加', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, enum_.ValueTypeData, /^(.+)\*(\d+)$/);

            const mockEnum = new Mock<IReadonlyEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            const mockAItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                data: {
                    text: 'A',
                    value: 11
                }
            });
            mockEnum.expectReturn(
                r => r.get(mockAny),
                mockAItem.actual
            );

            const mockBItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                data: {
                    text: 'B',
                    value: 22
                }
            });
            mockEnum.expectReturn(
                r => r.get(mockAny),
                mockBItem.actual
            );

            const res = await self.parse(`A*1
B*22`);
            deepStrictEqual(res, [{
                count: 1,
                valueType: 11,
            }, {
                count: 22,
                valueType: 22,
            }]);
        });

        it('减少', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, enum_.ValueTypeData, /^(.+)\*(-\d+)$/);

            const mockEnum = new Mock<IReadonlyEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            const mockAItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                data: {
                    text: 'A',
                    value: 11
                }
            });
            mockEnum.expectReturn(
                r => r.get(mockAny),
                mockAItem.actual
            );

            const mockBItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                data: {
                    text: 'B',
                    value: 22
                }
            });
            mockEnum.expectReturn(
                r => r.get(mockAny),
                mockBItem.actual
            );

            const res = await self.parse(`A*-15
B*-5`);
            deepStrictEqual(res, [{
                count: -15,
                valueType: 11,
            }, {
                count: -5,
                valueType: 22,
            }]);
        });

        it('ok', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, enum_.ValueTypeData);

            const mockEnum = new Mock<IReadonlyEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            const mockAItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                data: {
                    text: 'A',
                    value: 11
                }
            });
            mockEnum.expectReturn(
                r => r.get(mockAny),
                mockAItem.actual
            );

            const mockBItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                data: {
                    text: 'B',
                    value: 22
                }
            });
            mockEnum.expectReturn(
                r => r.get(mockAny),
                mockBItem.actual
            );

            const res = await self.parse(`A*-5
B*5`);
            deepStrictEqual(res, [{
                count: -5,
                valueType: 11,
            }, {
                count: 5,
                valueType: 22,
            }]);
        });
    });
});
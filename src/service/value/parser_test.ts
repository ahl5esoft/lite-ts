import { deepStrictEqual } from 'assert';
import { Mock, mockAny } from 'lite-ts-mock';

import { ValueParser as Self } from './parser';
import { EnumBase, EnumFactoryBase, IEnumItem } from '../../contract';
import { enum_ } from '../../model';


describe('src/service/value/parser.ts', () => {
    describe('.parse(text: string)', () => {
        it('增加', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, /^(.+)\*(\d+)$/);

            const mockEnum = new Mock<EnumBase<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            const mockAItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                entry: {
                    text: 'A',
                    value: 11
                }
            });
            mockEnum.expectReturn(
                r => r.get(mockAny),
                mockAItem.actual
            );

            const mockBItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                entry: {
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
            const self = new Self(mockEnumFactory.actual, /^(.+)\*(-\d+)$/);

            const mockEnum = new Mock<EnumBase<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            const mockAItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                entry: {
                    text: 'A',
                    value: 11
                }
            });
            mockEnum.expectReturn(
                r => r.get(mockAny),
                mockAItem.actual
            );

            const mockBItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                entry: {
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
            const self = new Self(mockEnumFactory.actual);

            const mockEnum = new Mock<EnumBase<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            const mockAItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                entry: {
                    text: 'A',
                    value: 11
                }
            });
            mockEnum.expectReturn(
                r => r.get(mockAny),
                mockAItem.actual
            );

            const mockBItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                entry: {
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
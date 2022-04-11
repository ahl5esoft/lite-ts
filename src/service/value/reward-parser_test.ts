import { deepStrictEqual } from 'assert';

import { ValueRewardParser as Self } from './reward-parser';
import { Mock, mockAny } from '../assert';
import { EnumFactoryBase, IEnum, IEnumItem } from '../..';
import { enum_ } from '../../model';


describe('src/service/value/reward-parser.ts', () => {
    describe('.parse(text: string)', () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, enum_.ValueTypeData);

            const mockEnum = new Mock<IEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockEnum.actual
            );

            const mockAItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                data: {
                    text: '金币',
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

            const mockBItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                data: {
                    text: '宝石',
                    value: 22
                }
            });
            mockEnum.expectReturn(
                r => r.get(mockAny),
                mockBItem.actual
            );
            mockEnum.expectReturn(
                r => r.get(mockAny),
                mockBItem.actual
            );

            const res = await self.parse(`金币*500*999\r\n金币*5000*1\r\n\r\n宝石*3*999\r\n宝石*30*1`);
            deepStrictEqual(res, [
                [{
                    count: 500,
                    valueType: 11,
                    weight: 999
                }, {
                    count: 5000,
                    valueType: 11,
                    weight: 1
                }],
                [{
                    count: 3,
                    valueType: 22,
                    weight: 999
                }, {
                    count: 30,
                    valueType: 22,
                    weight: 1
                }]
            ]);
        });
    });
});
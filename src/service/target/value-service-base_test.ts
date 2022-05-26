import { deepStrictEqual, strictEqual } from 'assert';
import moment from 'moment';

import { TargetValueServiceBase } from './value-service-base';
import { Mock, mockAny } from '../assert';
import {
    EnumFactoryBase,
    IEnum,
    IEnumItem,
    IUnitOfWork,
    IValueConditionData,
    IValueData,
    NowTimeBase
} from '../../contract';
import { enum_, global } from '../../model';

class Self extends TargetValueServiceBase<global.UserValue> {
    public entry: Promise<global.UserValue>;

    public async update(_: IUnitOfWork, __: IValueData[]) { }

    protected async getEntry() {
        return this.entry;
    }
}

describe('src/service/target/value-service-base.ts', () => {
    describe('.checkConditions(uow: IUnitOfWork, conditions: IValueConditionData[])', () => {
        it(`${enum_.RelationOperator.eq}(单组)`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 11;
            });

            const res = await self.checkConditions(null, [[{
                count: 11,
                op: enum_.RelationOperator.eq,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.eq}(单组)不通过`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 1;
            });

            const res = await self.checkConditions(null, [[{
                count: 11,
                op: enum_.RelationOperator.eq,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.eqNowDiff}(单组)`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 9;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: enum_.RelationOperator.eqNowDiff,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.eqNowDiff}(单组)不通过`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 10;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: enum_.RelationOperator.eqNowDiff,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.ge}(单组)`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 11;
            });

            const res = await self.checkConditions(null, [[{
                count: 11,
                op: enum_.RelationOperator.ge,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.ge}(单组)不通过`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 10;
            });

            const res = await self.checkConditions(null, [[{
                count: 11,
                op: enum_.RelationOperator.ge,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.geNowDiff}(单组)`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 9;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: enum_.RelationOperator.geNowDiff,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.geNowDiff}(单组)不通过`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 10;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: enum_.RelationOperator.geNowDiff,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.gt}(单组)`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 12;
            });

            const res = await self.checkConditions(null, [[{
                count: 11,
                op: enum_.RelationOperator.gt,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.gt}(单组)不通过`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 11;
            });

            const res = await self.checkConditions(null, [[{
                count: 11,
                op: enum_.RelationOperator.gt,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.gtNowDiff}(单组)`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 8;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: enum_.RelationOperator.gtNowDiff,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.gtNowDiff}(单组)不通过`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 11;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: enum_.RelationOperator.gtNowDiff,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.le}(单组)`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 11;
            });

            const res = await self.checkConditions(null, [[{
                count: 11,
                op: enum_.RelationOperator.le,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.le}(单组)不通过`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 12;
            });

            const res = await self.checkConditions(null, [[{
                count: 11,
                op: enum_.RelationOperator.le,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.leNowDiff}(单组)`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 9;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: enum_.RelationOperator.leNowDiff,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.leNowDiff}(单组)不通过`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 8;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: enum_.RelationOperator.leNowDiff,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.lt}(单组)`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 10;
            });

            const res = await self.checkConditions(null, [[{
                count: 11,
                op: enum_.RelationOperator.lt,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.lt}(单组)不通过`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 11;
            });

            const res = await self.checkConditions(null, [[{
                count: 11,
                op: enum_.RelationOperator.lt,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.ltNowDiff}(单组)`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 10;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: enum_.RelationOperator.ltNowDiff,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.ltNowDiff}(单组)不通过`, async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', () => {
                return 8;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: enum_.RelationOperator.ltNowDiff,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it('all(单组)', async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', (_: IUnitOfWork, valueType: number) => {
                return {
                    1: 11,
                    2: 22,
                    3: 33
                }[valueType];
            });

            const res = await self.checkConditions(null, [[{
                count: 11,
                op: enum_.RelationOperator.eq,
                valueType: 1
            }, {
                count: 20,
                op: enum_.RelationOperator.gt,
                valueType: 2
            }, {
                count: 35,
                op: enum_.RelationOperator.lt,
                valueType: 3
            }]]);
            strictEqual(res, true);
        });

        it('some(单组)', async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', (_: IUnitOfWork, valueType: number) => {
                return {
                    1: 11,
                    2: 22,
                    3: 33
                }[valueType];
            });

            const res = await self.checkConditions(null, [[{
                count: 9,
                op: enum_.RelationOperator.eq,
                valueType: 1
            }, {
                count: 20,
                op: enum_.RelationOperator.gt,
                valueType: 2
            }, {
                count: 35,
                op: enum_.RelationOperator.lt,
                valueType: 3
            }]]);
            strictEqual(res, false);
        });

        it('多组', async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, mockNowTime.actual);

            mockNowTime.expectReturn(
                r => r.unix(),
                10
            );

            Reflect.set(self, 'getCount', (_: IUnitOfWork, valueType: number) => {
                return {
                    1: 11,
                    2: 22,
                    3: 33
                }[valueType];
            });

            const res = await self.checkConditions(null, [
                [{
                    count: 11,
                    op: enum_.RelationOperator.eq,
                    valueType: 1
                }, {
                    count: 20,
                    op: enum_.RelationOperator.gt,
                    valueType: 2
                }, {
                    count: 35,
                    op: enum_.RelationOperator.lt,
                    valueType: 3
                }],
                [{
                    count: 9,
                    op: enum_.RelationOperator.eq,
                    valueType: 1
                }, {
                    count: 20,
                    op: enum_.RelationOperator.gt,
                    valueType: 2
                }, {
                    count: 35,
                    op: enum_.RelationOperator.lt,
                    valueType: 3
                }]
            ]);
            strictEqual(res, true);
        });
    });

    describe('.enough(uow: IUnitOfWork, values: IValueData[])', () => {
        it('ok', async () => {
            const self = new Self(null, null);

            Reflect.set(self, 'checkConditions', (_: IUnitOfWork, res: IValueConditionData[]) => {
                deepStrictEqual(res, [[{
                    count: 11,
                    op: enum_.RelationOperator.ge,
                    valueType: 1
                }, {
                    count: 22,
                    op: enum_.RelationOperator.ge,
                    valueType: 2
                }]]);
            });

            await self.enough(null, [{
                count: -11,
                valueType: 1
            }, {
                count: 22,
                valueType: 2
            }]);
        });
    });

    describe('.getCount(_: IUnitOfWork, valueType: number)', () => {
        it('entry = null', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, null);

            const mockValueTypeEnum = new Mock<IEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockValueTypeEnum.actual
            );

            mockValueTypeEnum.expectReturn(
                r => r.get(mockAny),
                null
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });

        it('entry.value[valueType] = null', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, null);

            const mockValueTypeEnum = new Mock<IEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockValueTypeEnum.actual
            );

            Reflect.set(self, 'entry', {
                id: '',
                values: {}
            });

            mockValueTypeEnum.expectReturn(
                r => r.get(mockAny),
                null
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });

        it('枚举存在但dailyTime无效', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(mockEnumFactory.actual, mockNowTime.actual);

            const mockValueTypeEnum = new Mock<IEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockValueTypeEnum.actual
            );

            Reflect.set(self, 'entry', {
                id: '',
                values: {
                    1: 11
                }
            });

            const mockEnumItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                data: {}
            });
            mockValueTypeEnum.expectReturn(
                r => r.get(mockAny),
                mockEnumItem.actual
            );

            mockNowTime.expectReturn(
                r => r.unix(),
                moment().unix()
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 11);
        });

        it('dailyTime(重置)', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(mockEnumFactory.actual, mockNowTime.actual);

            const mockValueTypeEnum = new Mock<IEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockValueTypeEnum.actual
            );

            Reflect.set(self, 'entry', {
                id: '',
                values: {
                    1: 11,
                    2: 22
                }
            });

            const mockEnumItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                data: {
                    dailyTime: 2
                }
            });
            mockValueTypeEnum.expectReturn(
                r => r.get(mockAny),
                mockEnumItem.actual
            );

            mockNowTime.expectReturn(
                r => r.unix(),
                moment().unix()
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });

        it('dailyTime(不重置)', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(mockEnumFactory.actual, mockNowTime.actual);

            const mockValueTypeEnum = new Mock<IEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockValueTypeEnum.actual
            );

            Reflect.set(self, 'entry', {
                id: '',
                values: {
                    1: 11,
                    2: moment().unix()
                }
            });

            const mockEnumItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                data: {
                    dailyTime: 2
                }
            });
            mockValueTypeEnum.expectReturn(
                r => r.get(mockAny),
                mockEnumItem.actual
            );

            mockNowTime.expectReturn(
                r => r.unix(),
                moment().unix()
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 11);
        });
    });
});
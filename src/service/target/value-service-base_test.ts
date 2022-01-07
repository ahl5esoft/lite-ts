import { deepStrictEqual, strictEqual } from 'assert';

import { TargetValueServiceBase } from './value-service-base';
import { Mock, mockAny } from '..';
import { IEnum, IEnumItem, ITargetValueData, IUnitOfWork, IValueConditionData, IValueData, IValueTypeData, NowTimeBase } from '../..';
import { enum_ } from '../../model';
import moment from 'moment';

class TargetValue implements ITargetValueData {
    public id: string;
    public values: { [key: number]: number };
}

class ValueTypeData implements IValueTypeData {
    public value: number;
    public isReplace?: boolean;
    public todayTime?: number;
}

class Self extends TargetValueServiceBase<TargetValue, ValueTypeData> {
    public entry: TargetValue;

    public async update(_: IUnitOfWork, __: IValueData[]) { }

    protected async getEntry() {
        return this.entry;
    }
}

describe('src/service/target/value-service-base.ts', () => {
    describe('.checkConditions(uow: IUnitOfWork, conditions: IValueConditionData[])', () => {
        it('=(单组)', async () => {
            const self = new Self(null, null);

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

        it('>=(单组)', async () => {
            const self = new Self(null, null);

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

        it('>(单组)', async () => {
            const self = new Self(null, null);

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

        it('<=(单组)', async () => {
            const self = new Self(null, null);

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

        it('<(单组)', async () => {
            const self = new Self(null, null);

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

        it('all(单组)', async () => {
            const self = new Self(null, null);

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
            const self = new Self(null, null);

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
            const self = new Self(null, null);

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
            const mockValueTypeEnum = new Mock<IEnum<ValueTypeData>>();
            const self = new Self(mockValueTypeEnum.actual, null);

            mockValueTypeEnum.expectReturn(
                r => r.get(mockAny),
                null
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });

        it('entry.value[valueType] = null', async () => {
            const mockValueTypeEnum = new Mock<IEnum<ValueTypeData>>();
            const self = new Self(mockValueTypeEnum.actual, null);

            self.entry = {
                id: '',
                values: {}
            };

            mockValueTypeEnum.expectReturn(
                r => r.get(mockAny),
                null
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });

        it('枚举存在但dailyTime无效', async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const mockEnum = new Mock<IEnum<ValueTypeData>>();
            const self = new Self(mockEnum.actual, mockNowTime.actual);

            self.entry = {
                id: '',
                values: {
                    1: 11
                }
            };

            const mockEnumItem = new Mock<IEnumItem<ValueTypeData>>({
                data: {}
            });
            mockEnum.expectReturn(
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
            const mockNowTime = new Mock<NowTimeBase>();
            const mockEnum = new Mock<IEnum<ValueTypeData>>();
            const self = new Self(mockEnum.actual, mockNowTime.actual);

            self.entry = {
                id: '',
                values: {
                    1: 11,
                    2: 22
                }
            };

            const mockEnumItem = new Mock<IEnumItem<ValueTypeData>>({
                data: {
                    dailyTime: 2
                }
            });
            mockEnum.expectReturn(
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
            const mockNowTime = new Mock<NowTimeBase>();
            const mockEnum = new Mock<IEnum<ValueTypeData>>();
            const self = new Self(mockEnum.actual, mockNowTime.actual);

            self.entry = {
                id: '',
                values: {
                    1: 11,
                    2: moment().unix()
                }
            };

            const mockEnumItem = new Mock<IEnumItem<ValueTypeData>>({
                data: {
                    dailyTime: 2
                }
            });
            mockEnum.expectReturn(
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
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import moment from 'moment';

import { EnumBase } from './enum-base';
import { EnumFactoryBase } from './enum-factory-base';
import { IUnitOfWork } from './i-unit-of-work';
import { UserServiceBase } from './user-service-base';
import { ValueServiceBase } from './value-service-base';
import { contract, enum_, global } from '../model';
import { BigIntegerMath } from '../service';

class Self extends ValueServiceBase<global.UserValue> {
    public constructor(
        enumFactory: EnumFactoryBase,
        userService: UserServiceBase,
        getEntryFunc: () => Promise<global.UserValue>,
    ) {
        super(userService, enumFactory, new BigIntegerMath(), getEntryFunc);
    }

    public async update(_: IUnitOfWork, __: contract.IValue[]) { }
}

describe('src/contract/value-service-base.ts', () => {
    describe('.entry', () => {
        it('ok', async () => {
            const self = new Self(null, null, async () => {
                return {} as global.UserValue;
            });

            const res = await self.entry;
            deepStrictEqual(res, {});
        });
    });

    describe('.checkConditions(uow: IUnitOfWork, conditions: contract.IValueCondition[])', () => {
        it(`${enum_.RelationOperator.eq}(单组)`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

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
            const self = new Self(null, {
                now: 10
            } as any, null);

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

        it(`${enum_.RelationOperator.nowDiff}${enum_.RelationOperator.eq}(单组)`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 9;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: (enum_.RelationOperator.eq + enum_.RelationOperator.nowDiff) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.nowDiff}${enum_.RelationOperator.eq}(单组)不通过`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 10;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: (enum_.RelationOperator.eq + enum_.RelationOperator.nowDiff) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.ge}(单组)`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

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
            const self = new Self(null, {
                now: 10
            } as any, null);

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

        it(`${enum_.RelationOperator.nowDiff}${enum_.RelationOperator.ge}(单组)`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 9;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: (enum_.RelationOperator.nowDiff + enum_.RelationOperator.ge) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.nowDiff}${enum_.RelationOperator.ge}(单组)不通过`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 10;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: (enum_.RelationOperator.nowDiff + enum_.RelationOperator.ge) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.gt}(单组)`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

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
            const self = new Self(null, {
                now: 10
            } as any, null);

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

        it(`${enum_.RelationOperator.nowDiff}${enum_.RelationOperator.gt}(单组)`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 8;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: (enum_.RelationOperator.nowDiff + enum_.RelationOperator.gt) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.nowDiff}${enum_.RelationOperator.gt}(单组)不通过`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 11;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: (enum_.RelationOperator.nowDiff + enum_.RelationOperator.gt) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.le}(单组)`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

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
            const self = new Self(null, {
                now: 10
            } as any, null);

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

        it(`${enum_.RelationOperator.nowDiff}${enum_.RelationOperator.lt}(单组)`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 9;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: (enum_.RelationOperator.nowDiff + enum_.RelationOperator.le) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.nowDiff}${enum_.RelationOperator.le}(单组)不通过`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 8;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: (enum_.RelationOperator.nowDiff + enum_.RelationOperator.le) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.lt}(单组)`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

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
            const self = new Self(null, {
                now: 10
            } as any, null);

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

        it(`${enum_.RelationOperator.nowDiff}${enum_.RelationOperator.lt}(单组)`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 10;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: (enum_.RelationOperator.nowDiff + enum_.RelationOperator.lt) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.nowDiff}${enum_.RelationOperator.lt}(单组)不通过`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 8;
            });

            const res = await self.checkConditions(null, [[{
                count: 1,
                op: (enum_.RelationOperator.nowDiff + enum_.RelationOperator.lt) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.mod}${enum_.RelationOperator.eq}(单组)`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 11;
            });

            const res = await self.checkConditions(null, [[{
                count: 201,
                op: (enum_.RelationOperator.mod + enum_.RelationOperator.eq) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.mod}${enum_.RelationOperator.eq}(单组)不通过`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 10;
            });

            const res = await self.checkConditions(null, [[{
                count: 201,
                op: (enum_.RelationOperator.mod + enum_.RelationOperator.eq) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.mod}${enum_.RelationOperator.ge}(单组)`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 11;
            });

            const res = await self.checkConditions(null, [[{
                count: 200,
                op: (enum_.RelationOperator.mod + enum_.RelationOperator.ge) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.mod}${enum_.RelationOperator.ge}(单组)不通过`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 3;
            });

            const res = await self.checkConditions(null, [[{
                count: 301,
                op: (enum_.RelationOperator.mod + enum_.RelationOperator.ge) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.mod}${enum_.RelationOperator.gt}(单组)`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 11;
            });

            const res = await self.checkConditions(null, [[{
                count: 200,
                op: (enum_.RelationOperator.mod + enum_.RelationOperator.gt) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.mod}${enum_.RelationOperator.gt}(单组)不通过`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 3;
            });

            const res = await self.checkConditions(null, [[{
                count: 301,
                op: (enum_.RelationOperator.mod + enum_.RelationOperator.gt) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.mod}${enum_.RelationOperator.le}(单组)`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 11;
            });

            const res = await self.checkConditions(null, [[{
                count: 201,
                op: (enum_.RelationOperator.mod + enum_.RelationOperator.le) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.mod}${enum_.RelationOperator.le}(单组)不通过`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 2;
            });

            const res = await self.checkConditions(null, [[{
                count: 301,
                op: (enum_.RelationOperator.mod + enum_.RelationOperator.le) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it(`${enum_.RelationOperator.mod}${enum_.RelationOperator.lt}(单组)`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 10;
            });

            const res = await self.checkConditions(null, [[{
                count: 201,
                op: (enum_.RelationOperator.mod + enum_.RelationOperator.lt) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, true);
        });

        it(`${enum_.RelationOperator.mod}${enum_.RelationOperator.lt}(单组)不通过`, async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', () => {
                return 2;
            });

            const res = await self.checkConditions(null, [[{
                count: 301,
                op: (enum_.RelationOperator.mod + enum_.RelationOperator.lt) as enum_.RelationOperator,
                valueType: 1
            }]]);
            strictEqual(res, false);
        });

        it('all(单组)', async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

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
            const self = new Self(null, {
                now: 10
            } as any, null);

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
            const self = new Self(null, {
                now: 10
            } as any, null);

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

    describe('.checkEnough(uow: IUnitOfWork, times: number, consumeValues: model.contract.IValue[])', () => {
        it('ok', async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', (_: any, arg: number) => {
                strictEqual(arg, 2);
                return 99;
            });

            let err: Error;
            try {
                await self.checkEnough(null, 2, [{
                    count: -1,
                    valueType: 2
                }]);
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
        });

        it('false', async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);

            Reflect.set(self, 'getCount', (_: any, arg: number) => {
                strictEqual(arg, 2);
                return 0;
            });

            let err: Error;
            try {
                await self.checkEnough(null, 2, [{
                    count: -1,
                    valueType: 2
                }]);
            } catch (ex) {
                err = ex;
            }
            notStrictEqual(err, undefined);
        });
    });

    describe('.compatibleValueType(allItem: { [value: number]: IEnumItem<enum_.ValueTypeData>; }, valueType: number)', () => {
        it('dailyTime', async () => {
            const self = new Self(null, {
                now: 10
            } as any, null);
            const fn = Reflect.get(self, 'compatibleValueType').bind(this);
            const allItem = {
                1: {
                    entry: {
                        dailyTime: 2
                    }
                },
                2: {
                    entry: {}
                }
            };
            await fn(allItem, 1);
            deepStrictEqual(allItem[1].entry, {
                dailyTime: 2,
                time: {
                    valueType: 2
                }
            });
            deepStrictEqual(allItem[2].entry, {
                time: {
                    momentType: 'day'
                }
            });
        });
    });

    describe('.getCount(_: IUnitOfWork, valueType: number)', () => {
        it('entry = null', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, null, async () => {
                return Promise.resolve({} as global.UserValue);
            });

            const mockValueTypeEnum = new Mock<EnumBase<enum_.ValueTypeData>>({
                items: {}
            });
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockValueTypeEnum.actual
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });

        it('entry.value[valueType] = null', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, null, async () => {
                return Promise.resolve({
                    id: '',
                    values: {}
                });
            });

            const mockValueTypeEnum = new Mock<EnumBase<enum_.ValueTypeData>>({
                items: {}
            });
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockValueTypeEnum.actual
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });

        it('枚举存在但time无效', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(mockEnumFactory.actual, {
                now: 0
            } as any, async () => {
                return Promise.resolve({
                    id: '',
                    values: {
                        1: 11
                    }
                });
            });

            const mockValueTypeEnum = new Mock<EnumBase<enum_.ValueTypeData>>({
                items: {
                    1: {
                        entry: {}
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockValueTypeEnum.actual
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 11);
        });

        it('time(重置)', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const entry = {
                id: '',
                values: {
                    1: 11,
                    2: moment().add(-1, 'day').unix()
                }
            } as global.UserValue;
            const self = new Self(mockEnumFactory.actual, {
                now: 99
            } as any, async () => {
                return Promise.resolve(entry);
            });

            const mockValueTypeEnum = new Mock<EnumBase<enum_.ValueTypeData>>({
                allItem: {
                    1: {
                        entry: {
                            time: {
                                valueType: 2
                            }
                        }
                    },
                    2: {
                        entry: {
                            time: {
                                momentType: 'day'
                            }
                        }
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockValueTypeEnum.actual
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);

            deepStrictEqual(entry.values, {
                1: 0,
                2: 99
            });
        });

        it('time(不重置)', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const time = moment().unix();
            const entry = {
                id: '',
                values: {
                    1: 11,
                    2: time,
                }
            } as global.UserValue;
            const self = new Self(mockEnumFactory.actual, {
                now: moment().unix()
            } as any, async () => {
                return Promise.resolve(entry);
            });

            const mockValueTypeEnum = new Mock<EnumBase<enum_.ValueTypeData>>({
                allItem: {
                    1: {
                        entry: {
                            time: {
                                valueType: 2
                            }
                        }
                    },
                    2: {
                        entry: {
                            time: {
                                momentType: 'hour'
                            }
                        }
                    }
                }
            });
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockValueTypeEnum.actual
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 11);

            deepStrictEqual(entry.values, {
                1: 11,
                2: time
            });
        });
    });
});
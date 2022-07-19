import { deepStrictEqual, strictEqual } from 'assert';
import moment from 'moment';

import { DbValueServiceBase } from './value-service-base';
import { Mock, mockAny } from '../assert';
import { CustomError } from '../error';
import {
    DbFactoryBase,
    DbRepositoryBase,
    EnumFactoryBase,
    IEnum,
    IEnumItem,
    IUnitOfWork,
    IUserAssociateService,
    IValueData,
    IValueInterceptor,
    StringGeneratorBase,
    ValueInterceptorFactoryBase,
} from '../../contract';
import { enum_, global } from '../../model';

class Self extends DbValueServiceBase<global.UserValue, global.UserValueChange, global.UserValueLog> {
    public entry: any;

    private m_ChagneEntries: global.UserValueChange[];
    public set changeEntries(v: global.UserValueChange[]) {
        this.changeEntries = v;
    }

    protected createEntry() {
        return {} as global.UserValue;
    }

    protected createChangeEntry() {
        return {
            userID: this.entry.id
        } as global.UserValueChange;
    }

    protected createLogEntry() {
        return {
            userID: this.entry.id
        } as global.UserValueLog;
    }

    protected async findAndClearChangeEntries() {
        const changeEntries = this.m_ChagneEntries;
        this.changeEntries = [];
        return changeEntries;
    }

    protected async getNow() {
        return 0;
    }
}

describe('src/service/db/value-service-base.ts', () => {
    describe('.getCount(uow: IUnitOfWork, valueType: number)', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(null, mockDbFactory.actual, null, null, global.UserValue, global.UserValueChange, global.UserValueLog, null, null);

            Reflect.set(self, 'findChangeEntries', () => {
                return [{}];
            });

            const mockDbRepo = new Mock<DbRepositoryBase<global.UserValueChange>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserValueChange, null),
                mockDbRepo.actual
            );

            mockDbRepo.expected.remove({} as global.UserValueChange);

            Reflect.set(self, 'update', (_: IUnitOfWork, res: IValueData[]) => {
                deepStrictEqual(res, [{}]);
            });

            Reflect.set(self, 'getCount', () => {
                return 0;
            });

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });
    });

    describe('.update(uow: IUnitOfWork, values: IValueData[])', () => {
        it('Iglobal.UserValueData不存在', async () => {
            const mockAssociateService = new Mock<IUserAssociateService>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockAssociateService.actual, mockDbFactory.actual, null, null, global.UserValue, global.UserValueChange, global.UserValueLog, null, null);

            Reflect.set(self, 'getEntry', () => { });

            const mockValueDbRepo = new Mock<DbRepositoryBase<global.UserValue>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserValue, null),
                mockValueDbRepo.actual
            );

            let isCalledCreateEntry = false;
            Reflect.set(self, 'createEntry', () => {
                isCalledCreateEntry = true;
                return {};
            });

            const targetValueEntry = {
                values: {}
            } as global.UserValue;
            mockValueDbRepo.expected.add(targetValueEntry);

            mockAssociateService.expected.add(global.UserValue.name, targetValueEntry);

            const mockLogDbRepo = new Mock<DbRepositoryBase<global.UserValueLog>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserValueLog, null),
                mockLogDbRepo.actual
            );

            mockValueDbRepo.expected.save({
                values: {}
            } as global.UserValue);

            await self.update(null, []);

            strictEqual(isCalledCreateEntry, true);
        });

        it('IValueTypeData.isPositive = true', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const mockValueInterceptorFactory = new Mock<ValueInterceptorFactoryBase>();
            const self = new Self(null, mockDbFactory.actual, mockStringGenerator.actual, mockValueInterceptorFactory.actual, global.UserValue, global.UserValueChange, global.UserValueLog, mockEnumFactory.actual, null);

            const entry = {
                id: 'uid',
                values: {
                    1: 10
                }
            } as global.UserValue;
            self.entry = entry;

            const mockValueDbRepo = new Mock<DbRepositoryBase<global.UserValue>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserValue, null),
                mockValueDbRepo.actual
            );

            const mockLogDbRepo = new Mock<DbRepositoryBase<global.UserValueLog>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserValueLog, null),
                mockLogDbRepo.actual
            );

            const valueChange = {
                count: -11,
                source: 'test',
                valueType: 1
            } as global.UserValueChange;

            const mockValueInterceptor = new Mock<IValueInterceptor>();
            mockValueInterceptorFactory.expectReturn(
                r => r.build(valueChange),
                mockValueInterceptor.actual
            );

            mockValueInterceptor.expectReturn(
                r => r.before(null, self, valueChange),
                false
            );

            Reflect.set(self, 'createLogEntry', () => {
                return {};
            });

            const logID = 'log-id';
            mockStringGenerator.expectReturn(
                r => r.generate(),
                logID
            );

            const mockValueType = new Mock<IEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockValueType.actual
            );

            const mockValueTypeItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                data: {
                    isPositive: true
                }
            });
            mockValueType.expectReturn(
                r => r.get(mockAny),
                mockValueTypeItem.actual
            );

            let err: CustomError;
            try {
                await self.update(null, [valueChange]);
            } catch (ex) {
                err = ex;
            }
            strictEqual(err.code, enum_.ErrorCode.valueTypeNotEnough);
            deepStrictEqual(err.data, {
                consume: 11,
                count: 10,
                valueType: 1
            });
        });

        it('IValueTypeData.isReplace = true', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const mockValueInterceptorFactory = new Mock<ValueInterceptorFactoryBase>();
            const self = new Self(null, mockDbFactory.actual, mockStringGenerator.actual, mockValueInterceptorFactory.actual, global.UserValue, global.UserValueChange, global.UserValueLog, mockEnumFactory.actual, null);

            const entry = {
                id: 'uid',
                values: {
                    1: 10
                }
            } as global.UserValue;
            self.entry = entry;

            const mockValueDbRepo = new Mock<DbRepositoryBase<global.UserValue>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserValue, null),
                mockValueDbRepo.actual
            );

            const mockLogDbRepo = new Mock<DbRepositoryBase<global.UserValueLog>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserValueLog, null),
                mockLogDbRepo.actual
            );

            const valueChange = {
                count: 11,
                source: 'test',
                valueType: 1
            } as global.UserValueChange;

            const mockValueInterceptor = new Mock<IValueInterceptor>();
            mockValueInterceptorFactory.expectReturn(
                r => r.build(valueChange),
                mockValueInterceptor.actual
            );

            mockValueInterceptor.expectReturn(
                r => r.before(null, self, valueChange),
                false
            );

            Reflect.set(self, 'createLogEntry', () => {
                return {};
            });

            const logID = 'log-id';
            mockStringGenerator.expectReturn(
                r => r.generate(),
                logID
            );

            const mockValueType = new Mock<IEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockValueType.actual
            );

            const mockValueTypeItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                data: {
                    isReplace: true
                }
            });
            mockValueType.expectReturn(
                r => r.get(mockAny),
                mockValueTypeItem.actual
            );

            mockLogDbRepo.expected.add({
                count: 11,
                id: logID,
                oldCount: 10,
                source: valueChange.source,
                valueType: 1
            } as global.UserValueLog);

            mockValueInterceptor.expected.after(null, self, valueChange);

            mockValueDbRepo.expected.save({
                ...entry,
                values: {
                    1: 11
                }
            } as global.UserValue);

            await self.update(null, [valueChange]);
        });

        it('IValueTypeData.dailyTime', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const mockValueInterceptorFactory = new Mock<ValueInterceptorFactoryBase>();
            const self = new Self(null, mockDbFactory.actual, mockStringGenerator.actual, mockValueInterceptorFactory.actual, global.UserValue, global.UserValueChange, global.UserValueLog, mockEnumFactory.actual, null);

            const entry = {
                id: 'uid',
                values: {
                    1: 10
                }
            } as global.UserValue;
            self.entry = entry;

            const mockValueDbRepo = new Mock<DbRepositoryBase<global.UserValue>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserValue, null),
                mockValueDbRepo.actual
            );

            const mockLogDbRepo = new Mock<DbRepositoryBase<global.UserValueLog>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserValueLog, null),
                mockLogDbRepo.actual
            );

            const valueChange = {
                count: 11,
                source: 'test',
                valueType: 1
            } as global.UserValueChange;

            const mockValueInterceptor = new Mock<IValueInterceptor>();
            mockValueInterceptorFactory.expectReturn(
                r => r.build(valueChange),
                mockValueInterceptor.actual
            );

            mockValueInterceptor.expectReturn(
                r => r.before(null, self, valueChange),
                false
            );

            Reflect.set(self, 'createLogEntry', () => {
                return {};
            });

            const logID = 'log-id';
            mockStringGenerator.expectReturn(
                r => r.generate(),
                logID
            );

            const mockValueType = new Mock<IEnum<enum_.ValueTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                mockValueType.actual
            );

            const mockValueTypeItem = new Mock<IEnumItem<enum_.ValueTypeData>>({
                data: {
                    dailyTime: 2
                }
            });
            mockValueType.expectReturn(
                r => r.get(mockAny),
                mockValueTypeItem.actual
            );

            const nowUnix = moment().unix();
            Reflect.set(self, 'getNow', () => {
                return nowUnix;
            });

            mockLogDbRepo.expected.add({
                count: 11,
                id: logID,
                oldCount: 10,
                source: valueChange.source,
                valueType: 1
            } as global.UserValueLog);

            mockValueInterceptor.expected.after(null, self, valueChange);

            mockValueDbRepo.expected.save({
                ...entry,
                values: {
                    1: 11,
                    2: nowUnix
                }
            } as global.UserValue);

            await self.update(null, [valueChange]);
        });
    });
});
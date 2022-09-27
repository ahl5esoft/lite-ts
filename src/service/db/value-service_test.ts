import { deepStrictEqual, strictEqual } from 'assert';

import { DbValueService as Self } from './value-service';
import { Mock } from '../assert';
import {
    DbFactoryBase,
    DbRepositoryBase,
    IUnitOfWork,
    IUserAssociateService,
    UserServiceBase,
} from '../../contract';
import { contract, global } from '../../model';

describe('src/service/db/value-service-base.ts', () => {
    describe('.getCount(uow: IUnitOfWork, valueType: number)', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockAssociateService = new Mock<IUserAssociateService>();
            const mockUserService = new Mock<UserServiceBase>({
                associateService: mockAssociateService.actual
            });
            const predicate = (_: global.UserValueChange) => true;
            const self = new Self(
                mockDbFactory.actual,
                null,
                mockUserService.actual,
                null,
                null,
                global.UserValueChange,
                null,
                null,
                predicate,
                null,
                null,
            );

            mockAssociateService.expectReturn(
                r => r.findAndClear<global.UserValueChange>(global.UserValueChange.name, predicate),
                [{}]
            );

            const mockDbRepo = new Mock<DbRepositoryBase<global.UserValueChange>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserValueChange, null),
                mockDbRepo.actual
            );

            mockDbRepo.expected.remove({} as global.UserValueChange);

            Reflect.set(self, 'update', (_: IUnitOfWork, res: contract.IValue[]) => {
                deepStrictEqual(res, [{}]);
            });

            Reflect.set(self, 'getCount', () => {
                return 0;
            });

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });
    });

    describe('.update(uow: IUnitOfWork, values: contract.IValue[])', () => {
        // it('IValueTypeData不存在', async () => {
        //     const mockAssociateService = new Mock<IUserAssociateService>();
        //     const mockDbFactory = new Mock<DbFactoryBase>();
        //     const mockEnumFactory = new Mock<EnumFactoryBase>();
        //     const self = new Self(mockAssociateService.actual, mockDbFactory.actual, null, null, null, global.UserValue, global.UserValueChange, global.UserValueLog, mockEnumFactory.actual, null);

        //     Reflect.set(self, 'getEntry', () => { });

        //     const mockValueDbRepo = new Mock<DbRepositoryBase<global.UserValue>>();
        //     mockDbFactory.expectReturn(
        //         r => r.db(global.UserValue, null),
        //         mockValueDbRepo.actual
        //     );

        //     let isCalledCreateEntry = false;
        //     Reflect.set(self, 'createEntry', () => {
        //         isCalledCreateEntry = true;
        //         return {};
        //     });

        //     const targetValueEntry = {
        //         values: {}
        //     } as global.UserValue;
        //     mockValueDbRepo.expected.add(targetValueEntry);

        //     mockAssociateService.expected.add(global.UserValue.name, targetValueEntry);

        //     const mockLogDbRepo = new Mock<DbRepositoryBase<global.UserValueLog>>();
        //     mockDbFactory.expectReturn(
        //         r => r.db(global.UserValueLog, null),
        //         mockLogDbRepo.actual
        //     );

        //     const mockValueType = new Mock<IEnum<enum_.ValueTypeData>>({
        //         items: {}
        //     });
        //     mockEnumFactory.expectReturn(
        //         r => r.build(enum_.ValueTypeData),
        //         mockValueType.actual
        //     );

        //     Reflect.set(self, 'getNow', () => {
        //         return 0;
        //     });

        //     mockValueDbRepo.expected.save({
        //         values: {}
        //     } as global.UserValue);

        //     await self.update(null, []);

        //     strictEqual(isCalledCreateEntry, true);
        // });

        // it('IValueTypeData.dailyTime', async () => {
        //     const mockDbFactory = new Mock<DbFactoryBase>();
        //     const mockEnumFactory = new Mock<EnumFactoryBase>();
        //     const mockStringGenerator = new Mock<StringGeneratorBase>();
        //     const mockValueInterceptorFactory = new Mock<ValueInterceptorFactoryBase>();
        //     const self = new Self(null, mockDbFactory.actual, mockStringGenerator.actual, mockValueInterceptorFactory.actual, null, global.UserValue, global.UserValueChange, global.UserValueLog, mockEnumFactory.actual, null);

        //     const entry = {
        //         id: 'uid',
        //         values: {
        //             1: 10
        //         }
        //     } as global.UserValue;
        //     self.entry = entry;

        //     const mockValueDbRepo = new Mock<DbRepositoryBase<global.UserValue>>();
        //     mockDbFactory.expectReturn(
        //         r => r.db(global.UserValue, null),
        //         mockValueDbRepo.actual
        //     );

        //     const mockLogDbRepo = new Mock<DbRepositoryBase<global.UserValueLog>>();
        //     mockDbFactory.expectReturn(
        //         r => r.db(global.UserValueLog, null),
        //         mockLogDbRepo.actual
        //     );

        //     const valueChange = {
        //         count: 11,
        //         source: 'test',
        //         valueType: 1
        //     } as global.UserValueChange;

        //     const mockValueInterceptor = new Mock<IValueInterceptor>();
        //     mockValueInterceptorFactory.expectReturn(
        //         r => r.build(valueChange),
        //         mockValueInterceptor.actual
        //     );

        //     mockValueInterceptor.expectReturn(
        //         r => r.before(null, self, valueChange),
        //         false
        //     );

        //     Reflect.set(self, 'createLogEntry', () => {
        //         return {};
        //     });

        //     const logID = 'log-id';
        //     mockStringGenerator.expectReturn(
        //         r => r.generate(),
        //         logID
        //     );

        //     const mockValueType = new Mock<IEnum<enum_.ValueTypeData>>({
        //         allItem: {
        //             1: {
        //                 data: {
        //                     dailyTime: 2
        //                 }
        //             }
        //         }
        //     });
        //     mockEnumFactory.expectReturn(
        //         r => r.build(enum_.ValueTypeData),
        //         mockValueType.actual
        //     );

        //     const nowUnix = moment().unix();
        //     Reflect.set(self, 'getNow', () => {
        //         return nowUnix;
        //     });

        //     mockLogDbRepo.expected.add({
        //         count: 11,
        //         id: logID,
        //         oldCount: 10,
        //         source: valueChange.source + '(每日重置)',
        //         valueType: 1
        //     } as global.UserValueLog);

        //     mockValueInterceptor.expected.after(null, self, valueChange);

        //     mockValueDbRepo.expected.save({
        //         ...entry,
        //         values: {
        //             1: 11,
        //             2: nowUnix
        //         }
        //     } as global.UserValue);

        //     await self.update(null, [valueChange]);
        // });

        // it('IValueTypeData.isReplace = true', async () => {
        //     const mockDbFactory = new Mock<DbFactoryBase>();
        //     const mockStringGenerator = new Mock<StringGeneratorBase>();
        //     const mockEnumFactory = new Mock<EnumFactoryBase>();
        //     const mockValueInterceptorFactory = new Mock<ValueInterceptorFactoryBase>();
        //     const self = new Self(null, mockDbFactory.actual, mockStringGenerator.actual, mockValueInterceptorFactory.actual, null, global.UserValue, global.UserValueChange, global.UserValueLog, mockEnumFactory.actual, null);

        //     const entry = {
        //         id: 'uid',
        //         values: {
        //             1: 10
        //         }
        //     } as global.UserValue;
        //     self.entry = entry;

        //     const mockValueDbRepo = new Mock<DbRepositoryBase<global.UserValue>>();
        //     mockDbFactory.expectReturn(
        //         r => r.db(global.UserValue, null),
        //         mockValueDbRepo.actual
        //     );

        //     const mockLogDbRepo = new Mock<DbRepositoryBase<global.UserValueLog>>();
        //     mockDbFactory.expectReturn(
        //         r => r.db(global.UserValueLog, null),
        //         mockLogDbRepo.actual
        //     );

        //     const valueChange = {
        //         count: 11,
        //         source: 'test',
        //         valueType: 1
        //     } as global.UserValueChange;

        //     const mockValueInterceptor = new Mock<IValueInterceptor>();
        //     mockValueInterceptorFactory.expectReturn(
        //         r => r.build(valueChange),
        //         mockValueInterceptor.actual
        //     );

        //     mockValueInterceptor.expectReturn(
        //         r => r.before(null, self, valueChange),
        //         false
        //     );

        //     Reflect.set(self, 'createLogEntry', () => {
        //         return {};
        //     });

        //     const logID = 'log-id';
        //     mockStringGenerator.expectReturn(
        //         r => r.generate(),
        //         logID
        //     );

        //     const mockValueType = new Mock<IEnum<enum_.ValueTypeData>>({
        //         allItem: {
        //             1: {
        //                 data: {
        //                     isReplace: true
        //                 }
        //             }
        //         }
        //     });
        //     mockEnumFactory.expectReturn(
        //         r => r.build(enum_.ValueTypeData),
        //         mockValueType.actual
        //     );

        //     mockLogDbRepo.expected.add({
        //         count: 11,
        //         id: logID,
        //         oldCount: 10,
        //         source: valueChange.source,
        //         valueType: 1
        //     } as global.UserValueLog);

        //     mockValueInterceptor.expected.after(null, self, valueChange);

        //     mockValueDbRepo.expected.save({
        //         ...entry,
        //         values: {
        //             1: 11
        //         }
        //     } as global.UserValue);

        //     await self.update(null, [valueChange]);
        // });

        // it('IValueTypeData.isNegative = true', async () => {
        //     const mockDbFactory = new Mock<DbFactoryBase>();
        //     const mockStringGenerator = new Mock<StringGeneratorBase>();
        //     const mockEnumFactory = new Mock<EnumFactoryBase>();
        //     const mockValueInterceptorFactory = new Mock<ValueInterceptorFactoryBase>();
        //     const self = new Self(null, mockDbFactory.actual, mockStringGenerator.actual, mockValueInterceptorFactory.actual, null, global.UserValue, global.UserValueChange, global.UserValueLog, mockEnumFactory.actual, null);

        //     const entry = {
        //         id: 'uid',
        //         values: {
        //             1: 10
        //         }
        //     } as global.UserValue;
        //     self.entry = entry;

        //     const mockValueDbRepo = new Mock<DbRepositoryBase<global.UserValue>>();
        //     mockDbFactory.expectReturn(
        //         r => r.db(global.UserValue, null),
        //         mockValueDbRepo.actual
        //     );

        //     const mockLogDbRepo = new Mock<DbRepositoryBase<global.UserValueLog>>();
        //     mockDbFactory.expectReturn(
        //         r => r.db(global.UserValueLog, null),
        //         mockLogDbRepo.actual
        //     );

        //     const valueChange = {
        //         count: -11,
        //         source: 'test',
        //         valueType: 1
        //     } as global.UserValueChange;

        //     const mockValueInterceptor = new Mock<IValueInterceptor>();
        //     mockValueInterceptorFactory.expectReturn(
        //         r => r.build(valueChange),
        //         mockValueInterceptor.actual
        //     );

        //     mockValueInterceptor.expectReturn(
        //         r => r.before(null, self, valueChange),
        //         false
        //     );

        //     Reflect.set(self, 'createLogEntry', () => {
        //         return {};
        //     });

        //     const logID = 'log-id';
        //     mockStringGenerator.expectReturn(
        //         r => r.generate(),
        //         logID
        //     );

        //     const mockValueType = new Mock<IEnum<enum_.ValueTypeData>>({
        //         allItem: {
        //             1: {
        //                 data: {
        //                     isNegative: true
        //                 }
        //             }
        //         }
        //     });
        //     mockEnumFactory.expectReturn(
        //         r => r.build(enum_.ValueTypeData),
        //         mockValueType.actual
        //     );

        //     mockLogDbRepo.expected.add({
        //         count: -1,
        //         id: logID,
        //         oldCount: 10,
        //         source: valueChange.source,
        //         valueType: 1
        //     } as global.UserValueLog);

        //     mockValueInterceptor.expected.after(null, self, valueChange);

        //     mockValueDbRepo.expected.save({
        //         ...entry,
        //         values: {
        //             1: -1
        //         }
        //     } as global.UserValue);

        //     await self.update(null, [valueChange]);
        // });

        // it('ok', async () => {
        //     const mockDbFactory = new Mock<DbFactoryBase>();
        //     const mockStringGenerator = new Mock<StringGeneratorBase>();
        //     const mockEnumFactory = new Mock<EnumFactoryBase>();
        //     const mockValueInterceptorFactory = new Mock<ValueInterceptorFactoryBase>();
        //     const self = new Self(null, mockDbFactory.actual, mockStringGenerator.actual, mockValueInterceptorFactory.actual, null, global.UserValue, global.UserValueChange, global.UserValueLog, mockEnumFactory.actual, null);

        //     const entry = {
        //         id: 'uid',
        //         values: {
        //             1: 10
        //         }
        //     } as global.UserValue;
        //     self.entry = entry;

        //     const mockValueDbRepo = new Mock<DbRepositoryBase<global.UserValue>>();
        //     mockDbFactory.expectReturn(
        //         r => r.db(global.UserValue, null),
        //         mockValueDbRepo.actual
        //     );

        //     const mockLogDbRepo = new Mock<DbRepositoryBase<global.UserValueLog>>();
        //     mockDbFactory.expectReturn(
        //         r => r.db(global.UserValueLog, null),
        //         mockLogDbRepo.actual
        //     );

        //     const valueChange = {
        //         count: -11,
        //         source: 'test',
        //         valueType: 1
        //     } as global.UserValueChange;

        //     const mockValueInterceptor = new Mock<IValueInterceptor>();
        //     mockValueInterceptorFactory.expectReturn(
        //         r => r.build(valueChange),
        //         mockValueInterceptor.actual
        //     );

        //     mockValueInterceptor.expectReturn(
        //         r => r.before(null, self, valueChange),
        //         false
        //     );

        //     Reflect.set(self, 'createLogEntry', () => {
        //         return {};
        //     });

        //     const logID = 'log-id';
        //     mockStringGenerator.expectReturn(
        //         r => r.generate(),
        //         logID
        //     );

        //     const mockValueType = new Mock<IEnum<enum_.ValueTypeData>>({
        //         allItem: {}
        //     });
        //     mockEnumFactory.expectReturn(
        //         r => r.build(enum_.ValueTypeData),
        //         mockValueType.actual
        //     );

        //     let err: CustomError;
        //     try {
        //         await self.update(null, [valueChange]);
        //     } catch (ex) {
        //         err = ex;
        //     }
        //     strictEqual(err.code, enum_.ErrorCode.valueTypeNotEnough);
        //     deepStrictEqual(err.data, {
        //         consume: 11,
        //         count: 10,
        //         valueType: 1
        //     });
        // });
    });
});
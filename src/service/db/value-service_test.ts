import { deepStrictEqual, strictEqual } from 'assert';
import { Mock, mockAny } from 'lite-ts-mock';

import { BigIntegerMath } from '../big-integer';
import { DbValueService as Self } from './value-service';
import {
    DbFactoryBase,
    DbRepositoryBase,
    EnumBase,
    EnumFactoryBase,
    IUnitOfWork,
    IUserAssociateService,
    IValueInterceptor,
    RedisBase,
    StringGeneratorBase,
    UserServiceBase,
    ValueInterceptorFactoryBase,
} from '../../contract';
import { contract, enum_, global } from '../../model';

describe('src/service/db/value-service-base.ts', () => {
    describe('.getCount(uow: IUnitOfWork, valueType: number)', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const mockRedis = new Mock<RedisBase>();
            const mockAssociateService = new Mock<IUserAssociateService>();
            const mockUserService = new Mock<UserServiceBase>({
                associateService: mockAssociateService.actual,
                userID: 'uid'
            });
            const predicate = (_: global.UserValueChange) => true;

            const self = new Self(
                mockDbFactory.actual,
                mockRedis.actual,
                null,
                null,
                null,
                global.UserValueChange,
                null,
                null,
                predicate,
                null,
                mockUserService.actual,
                mockEnumFactory.actual,
                async () => {
                    return {
                        id: '',
                        values: {}
                    };
                }
            );

            mockAssociateService.expectReturn(
                r => r.findAndClear<global.UserValueChange>(global.UserValueChange.name, predicate),
                [{
                    id: 'change-id'
                }]
            );

            const mockDbRepo = new Mock<DbRepositoryBase<global.UserValueChange>>();
            mockDbFactory.expectReturn(
                r => r.db(global.UserValueChange, null),
                mockDbRepo.actual
            );

            mockDbRepo.expected.remove({
                id: 'change-id'
            } as global.UserValueChange);

            mockRedis.expectReturn(
                r => r.hsetnx('UserValueChange:uid', 'change-id', ''),
                true
            );

            Reflect.set(self, 'update', (_: IUnitOfWork, res: contract.IValue[]) => {
                deepStrictEqual(res, [{
                    id: 'change-id'
                }]);
            });

            mockRedis.expected.expire('UserValueChange:uid', 10);

            mockEnumFactory.expectReturn(
                r => r.build(enum_.ValueTypeData),
                {
                    allItem: {}
                }
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });
    });

    describe('.update(uow: IUnitOfWork, values: contract.IValue[]) ', () => {
        it('ok', async () => {
            const dbFactoryMock = new Mock<DbFactoryBase>();
            const stringGeneratorMock = new Mock<StringGeneratorBase>();
            const valueInterceptorFactoryMock = new Mock<ValueInterceptorFactoryBase>();
            const userServiceMock = new Mock<UserServiceBase>();
            const enumFactoryMock = new Mock<EnumFactoryBase>();
            const self = new Self(
                dbFactoryMock.actual,
                null,
                stringGeneratorMock.actual,
                valueInterceptorFactoryMock.actual,
                null,
                global.UserValueChange,
                () => {
                    const entry = new global.UserValue();
                    entry.id = 'test';
                    entry.values = {};
                    return entry;
                },
                () => {
                    const entry = new global.UserValueLog();
                    return entry;
                },
                null,
                new BigIntegerMath(),
                userServiceMock.actual,
                enumFactoryMock.actual,
                async () => {
                    return {
                        id: 'test',
                        values: {}
                    };
                },
            );

            const dbRepositoryMock = new Mock<DbRepositoryBase<global.UserValue>>();
            dbFactoryMock.expectReturn(
                r => r.db(global.UserValue, null),
                dbRepositoryMock.actual
            );
            dbRepositoryMock.expectReturn(
                r => r.save(mockAny),
                null
            );

            const enumMock = new Mock<EnumBase<enum_.ValueTypeData>>({
                allItems: Promise.resolve({
                    1: {
                        value: 1
                    },
                    2: {
                        value: 2,
                    }
                })
            });
            enumFactoryMock.expectReturn(
                r => r.build(enum_.ValueTypeData),
                enumMock.actual
            );

            const valueInterceptorMock1 = new Mock<IValueInterceptor>();
            valueInterceptorFactoryMock.expectReturn(
                r => r.build({
                    count: 1,
                    valueType: 1
                }),
                valueInterceptorMock1.actual
            );
            valueInterceptorMock1.expectReturn(
                r => r.before(null, self, {
                    count: 1,
                    valueType: 1
                }),
                false
            );
            valueInterceptorMock1.expected.after(null, self, {
                count: 1,
                valueType: 1
            });

            const valueInterceptorMock2 = new Mock<IValueInterceptor>();
            valueInterceptorFactoryMock.expectReturn(
                r => r.build({
                    count: '2',
                    valueType: 2
                }),
                valueInterceptorMock2.actual
            );
            valueInterceptorMock2.expectReturn(
                r => r.before(null, self, {
                    count: '2',
                    valueType: 2
                }),
                false
            );
            valueInterceptorMock2.expected.after(null, self, {
                count: '2',
                valueType: 2
            });

            const logDbRepositoryMock = new Mock<DbRepositoryBase<global.UserValueLog>>();
            dbFactoryMock.expectReturn(
                r => r.db(global.UserValueLog, null),
                logDbRepositoryMock.actual
            );
            logDbRepositoryMock.expectReturn(
                r => r.add(mockAny),
                null
            );
            logDbRepositoryMock.expectReturn(
                r => r.add(mockAny),
                null
            );

            stringGeneratorMock.expectReturn(
                r => r.generate(),
                '1'
            );

            stringGeneratorMock.expectReturn(
                r => r.generate(),
                '2'
            );

            await self.update(null, [
                {
                    count: 1,
                    valueType: 1
                },
                {
                    count: '2',
                    valueType: 2
                },
                {
                    count: 's',
                    valueType: 3
                }
            ]);
        });
    });
});
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';

import { DbUserServiceBase } from './user-service-base';
import { Mock, mockAny } from '../assert';
import { EnumFactoryBase, IEnum, IUserValueService } from '../../contract';
import { enum_ } from '../../model';

class Self extends DbUserServiceBase {
    public valueService: IUserValueService;
}

describe('src/service/db/user-service.ts', () => {
    describe('.getTargetValueService(targetType: number, targetValue: number)', () => {
        it('无效目标类型', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(null, null, null, mockEnumFactory.actual, null, null, null, null);

            const mockTargetTypeEnum = new Mock<IEnum<enum_.TargetTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.TargetTypeData),
                mockTargetTypeEnum.actual
            );

            mockTargetTypeEnum.expectReturn(
                r => r.get(mockAny),
                null
            );

            let err: Error;
            try {
                await self.getTargetValueService(2, 1);
            } catch (ex) {
                err = ex;
            }
            notStrictEqual(err, undefined);
            strictEqual(err.message, '无效目标类型: 1');
        });

        it('目标编号未缓存', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(null, null, null, mockEnumFactory.actual, null, null, null, null);

            const mockTargetTypeEnum = new Mock<IEnum<enum_.TargetTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.TargetTypeData),
                mockTargetTypeEnum.actual
            );

            mockTargetTypeEnum.expectReturn(
                r => r.get(mockAny),
                {
                    data: {
                        value: 1
                    }
                }
            );

            Reflect.set(self, 'createTargetValueService', (arg: enum_.TargetTypeData, arg1: number) => {
                deepStrictEqual(arg, {
                    value: 1
                });
                strictEqual(arg1, 2);
                return {};
            });

            let err: Error;
            try {
                const res = await self.getTargetValueService(2, 1);
                deepStrictEqual(res, {});
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);

            const targetValueServices = Reflect.get(self, 'm_TargetValueServices');
            deepStrictEqual(targetValueServices, {
                1: {
                    2: {}
                }
            });
        });

        it('ok', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const self = new Self(null, null, null, mockEnumFactory.actual, null, null, null, null);

            const mockTargetTypeEnum = new Mock<IEnum<enum_.TargetTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.TargetTypeData),
                mockTargetTypeEnum.actual
            );

            mockTargetTypeEnum.expectReturn(
                r => r.get(mockAny),
                {
                    data: {
                        value: 1
                    }
                }
            );

            Reflect.set(self, 'm_TargetValueServices', {
                1: {
                    2: {}
                }
            });

            let err: Error;
            try {
                const res = await self.getTargetValueService(2, 1);
                deepStrictEqual(res, {});
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
        });
    });
}); 
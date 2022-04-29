import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';

import { DbUserService as Self } from './user-service';
import { Mock, mockAny } from '../assert';
import { EnumFactoryBase, IEnum, RpcBase } from '../../contract';
import { enum_ } from '../../model';

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

        it('目标数值服务没有缓存', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const mockRpc = new Mock<RpcBase>();
            const userID = 'uid';
            const self = new Self(null, userID, null, mockEnumFactory.actual, null, mockRpc.actual, null, null);

            const mockTargetTypeEnum = new Mock<IEnum<enum_.TargetTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.TargetTypeData),
                mockTargetTypeEnum.actual
            );

            const targetTypeData = {
                app: 'test',
                value: 2
            } as enum_.TargetTypeData;
            mockTargetTypeEnum.expectReturn(
                r => r.get(mockAny),
                {
                    data: targetTypeData
                }
            );

            mockRpc.expectReturn(
                r => r.setBody({
                    userID
                }),
                mockRpc.actual
            );

            const targetValues = [{
                no: 1,
                values: {}
            }, {
                no: 2,
                values: {}
            }];
            mockRpc.expectReturn(
                r => r.call('/test/ih/find-values-by-user-id'),
                {
                    data: targetValues
                }
            );

            const mockTargetValueService1 = {
                entry: targetValues[0]
            };
            const mockTargetValueService2 = {
                entry: targetValues[1]
            };
            const assertTargetValueServices = [
                [targetValues[0], mockTargetValueService1],
                [targetValues[1], mockTargetValueService2]
            ];
            Reflect.set(self, 'createTargetValueService', (arg: any) => {
                let temp = assertTargetValueServices.shift();
                const vs = temp.pop();
                deepStrictEqual(temp, [arg]);
                return vs;
            });

            let err: Error;
            try {
                const res = await self.getTargetValueService(2, 1);
                strictEqual(res, mockTargetValueService2);
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
        });

        it('目标数值服务不存在', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const mockRpc = new Mock<RpcBase>();
            const userID = 'uid';
            const self = new Self(null, userID, null, mockEnumFactory.actual, null, mockRpc.actual, null, null);

            const mockTargetTypeEnum = new Mock<IEnum<enum_.TargetTypeData>>();
            mockEnumFactory.expectReturn(
                r => r.build(enum_.TargetTypeData),
                mockTargetTypeEnum.actual
            );

            const targetTypeData = {
                app: 'test',
                value: 2
            } as enum_.TargetTypeData;
            mockTargetTypeEnum.expectReturn(
                r => r.get(mockAny),
                {
                    data: targetTypeData
                }
            );

            mockRpc.expectReturn(
                r => r.setBody({
                    userID
                }),
                mockRpc.actual
            );

            mockRpc.expectReturn(
                r => r.call('/test/ih/find-values-by-user-id'),
                {
                    data: []
                }
            );

            let err: Error;
            try {
                await self.getTargetValueService(2, 1);
            } catch (ex) {
                err = ex;
            }
            strictEqual(err.message, '无效目标: test[2]');
        });
    });
}); 
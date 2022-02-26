import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';

import { UserService as Self } from './service';
import { Mock, mockAny } from '..';
import { IEnum, ITargetValueData, model, RpcBase } from '../..';

describe('src/service/user/service.ts', () => {
    describe('.getTargetValueService(targetType: number, targetValue: number)', () => {
        it('无效目标类型', async () => {
            const mockTargetTypeEnum = new Mock<IEnum<model.enum_.TargetTypeData>>();
            const self = new Self(null, null, null, mockTargetTypeEnum.actual, null, null, null, null, null);

            mockTargetTypeEnum.expectReturn(
                r => r.get(mockAny),
                null
            );

            let err: Error;
            try {
                await self.getTargetValueService(1, 1);
            } catch (ex) {
                err = ex;
            }
            notStrictEqual(err, undefined);
            strictEqual(err.message, '无效目标类型: 1');
        });

        it('目标数值服务没有缓存', async () => {
            const mockTargetTypeEnum = new Mock<IEnum<model.enum_.TargetTypeData>>();
            const mockRpc = new Mock<RpcBase>();
            const userID = 'uid';
            const self = new Self(null, userID, null, mockTargetTypeEnum.actual, null, null, mockRpc.actual, null, null);

            const targetTypeData = {
                app: 'test',
                value: 2
            } as model.enum_.TargetTypeData;
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
            }] as ITargetValueData[];
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
                [targetTypeData, targetValues[0], mockTargetValueService1],
                [targetTypeData, targetValues[1], mockTargetValueService2]
            ];
            Reflect.set(self, 'createTargetValueService', (arg: model.enum_.TargetTypeData, arg1: ITargetValueData) => {
                let temp = assertTargetValueServices.shift();
                const vs = temp.pop();
                deepStrictEqual(temp, [arg, arg1]);
                return vs;
            });

            let err: Error;
            try {
                const res = await self.getTargetValueService(1, 2);
                strictEqual(res, mockTargetValueService2);
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, undefined);
        });

        it('目标数值服务不存在', async () => {
            const mockTargetTypeEnum = new Mock<IEnum<model.enum_.TargetTypeData>>();
            const mockRpc = new Mock<RpcBase>();
            const userID = 'uid';
            const self = new Self(null, userID, null, mockTargetTypeEnum.actual, null, null, mockRpc.actual, null, null);

            const targetTypeData = {
                app: 'test',
                value: 2
            } as model.enum_.TargetTypeData;
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
                await self.getTargetValueService(1, 2);
            } catch (ex) {
                err = ex;
            }
            strictEqual(err.message, '无效目标: test[2]');
        });
    });
}); 
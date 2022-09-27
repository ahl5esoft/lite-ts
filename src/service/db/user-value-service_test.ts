import { DbUserValueService as Self } from './user-value-service';
import { Mock } from '../assert';
import { UserServiceBase, ValueServiceBase } from '../../contract';
import { global } from '../../model';

describe('src/service/user/value-service.ts', () => {
    describe('.update(uow: IUnitOfWork, values: IValueData[])', () => {
        it('ok', async () => {
            const mockUserService = new Mock<UserServiceBase>();
            const self = new Self(mockUserService.actual, null, null, null, null, null, null, 0);

            const mockValueService = new Mock<ValueServiceBase<global.UserValue>>();
            Reflect.set(self, 'm_ValueService', mockValueService.actual);

            mockUserService.expectReturn(
                r => r.getTargetValueService(2),
                mockValueService.actual
            );

            mockValueService.expected.update(null, [{
                count: 1,
                source: 'a',
                targetNo: 3,
                targetType: 2,
                valueType: 4
            }, {
                count: 2,
                source: 'b',
                targetNo: 3,
                targetType: 2,
                valueType: 5
            }, {
                count: 3,
                source: 'c',
                targetNo: 4,
                targetType: 2,
                valueType: 6
            }]);

            await self.update(null, [{
                count: 1,
                source: 'a',
                targetNo: 3,
                targetType: 2,
                valueType: 4
            }, {
                count: 2,
                source: 'b',
                targetNo: 3,
                targetType: 2,
                valueType: 5
            }, {
                count: 3,
                source: 'c',
                targetNo: 4,
                targetType: 2,
                valueType: 6
            }]);
        });
    });
});
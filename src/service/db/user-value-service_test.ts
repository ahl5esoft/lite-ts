import { DbUserValueService as Self } from './user-value-service';
import { Mock } from '../assert';
import { EnumFactoryBase, UserServiceBase, ValueServiceBase } from '../../contract';
import { enum_, global } from '../../model';

describe('src/service/user/value-service.ts', () => {
    describe('.update(uow: IUnitOfWork, values: IValueData[])', () => {
        it('ok', async () => {
            const mockEnumFactory = new Mock<EnumFactoryBase>();
            const mockUserService = new Mock<UserServiceBase>();
            const self = new Self(null, null, mockEnumFactory.actual, null, mockUserService.actual, null, null);

            const mockValueService = new Mock<ValueServiceBase<global.UserTargetValue>>();
            Reflect.set(self, 'm_ValueService', mockValueService.actual);

            Self.buildTargetValueServiceFunc = () => {
                return mockValueService.actual;
            };

            mockEnumFactory.expectReturn(
                r => r.build(enum_.TargetTypeData),
                {
                    allItem: {
                        2: {},
                    }
                }
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
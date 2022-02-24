import { strictEqual } from 'assert';

import { UserValueService as Self } from './value-service';
import { Mock } from '..';
import { ITargetValueService, IUserService, model } from '../..';

describe('src/service/user/value-service.ts', () => {
    describe('.checkConditions(uow: IUnitOfWork, conditions: IValueConditionData[][])', () => {
        it('ok', async () => {
            const mockUserService = new Mock<IUserService>();
            const self = new Self(mockUserService.actual, null, null, null, null, null);

            const mockValueService = new Mock<ITargetValueService>();
            mockUserService.expectReturn(
                r => r.getTargetValueService(2, 3),
                mockValueService.actual
            );

            mockValueService.expectReturn(
                r => r.checkConditions(null, [
                    [{
                        count: 1,
                        op: model.enum_.RelationOperator.eq,
                        targetType: 2,
                        targetValue: 3,
                        source: 'a',
                        valueType: 4
                    }, {
                        count: 1,
                        op: model.enum_.RelationOperator.eq,
                        targetType: 2,
                        targetValue: 3,
                        source: 'b',
                        valueType: 4
                    }]
                ]),
                true
            );

            mockUserService.expectReturn(
                r => r.getTargetValueService(2, 6),
                mockValueService.actual
            );

            mockValueService.expectReturn(
                r => r.checkConditions(null, [
                    [{
                        count: 1,
                        op: model.enum_.RelationOperator.eq,
                        targetType: 2,
                        targetValue: 6,
                        source: 'c',
                        valueType: 4
                    }]
                ]),
                true
            );

            const res = await self.checkConditions(null, [
                [{
                    count: 1,
                    op: model.enum_.RelationOperator.eq,
                    targetType: 2,
                    targetValue: 3,
                    source: 'a',
                    valueType: 4
                }, {
                    count: 1,
                    op: model.enum_.RelationOperator.eq,
                    targetType: 2,
                    targetValue: 3,
                    source: 'b',
                    valueType: 4
                }, {
                    count: 1,
                    op: model.enum_.RelationOperator.eq,
                    targetType: 2,
                    targetValue: 6,
                    source: 'c',
                    valueType: 4
                }]
            ]);
            strictEqual(res, true);
        });
    });

    describe('.update(uow: IUnitOfWork, values: IValueData[])', () => {
        it('ok', async () => {
            const mockUserService = new Mock<IUserService>();
            const self = new Self(mockUserService.actual, null, null, null, null, null);

            const mockValueService = new Mock<ITargetValueService>();
            mockUserService.expectReturn(
                r => r.getTargetValueService(2, 3),
                mockValueService.actual
            );

            mockValueService.expected.update(null, [{
                count: 1,
                source: 'a',
                targetType: 2,
                targetValue: 3,
                valueType: 4
            }, {
                count: 2,
                source: 'b',
                targetType: 2,
                targetValue: 3,
                valueType: 5
            }]);

            mockUserService.expectReturn(
                r => r.getTargetValueService(2, 4),
                mockValueService.actual
            );

            mockValueService.expected.update(null, [{
                count: 3,
                source: 'c',
                targetType: 2,
                targetValue: 4,
                valueType: 6
            }]);

            await self.update(null, [{
                count: 1,
                source: 'a',
                targetType: 2,
                targetValue: 3,
                valueType: 4
            }, {
                count: 2,
                source: 'b',
                targetType: 2,
                targetValue: 3,
                valueType: 5
            }, {
                count: 3,
                source: 'c',
                targetType: 2,
                targetValue: 4,
                valueType: 6
            }]);
        });
    });
});
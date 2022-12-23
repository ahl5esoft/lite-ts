import { strictEqual } from 'assert';

import { UserConditionActivityService as Self } from './condition-activity-service';
import { Mock } from '../assert';
import { IUnitOfWork, UserServiceBase, ValueServiceBase } from '../../contract';
import { enum_, global } from '../../model';

describe('src/service/user/condition-activity-service.ts', () => {
    describe('.initTime(uow: IUnitOfWork)', () => {
        it('ok', async () => {
            const mockUserValueService = new Mock<ValueServiceBase<global.UserValue>>();
            const mockUserService = new Mock<UserServiceBase>({
                valueService: mockUserValueService.actual
            });
            const self = new Self({
                contrastValueType: 1,
                closeConditions: [
                    [{
                        count: 1,
                        op: enum_.RelationOperator.gt,
                        valueType: 1,
                    }]
                ],
                hideConditions: [
                    [{
                        count: 2,
                        op: enum_.RelationOperator.gt,
                        valueType: 1,
                    }]
                ],
                openConditions: [
                    [{
                        count: 3,
                        op: enum_.RelationOperator.gt,
                        valueType: 1,
                    }]
                ]
            }, mockUserService.actual);

            mockUserValueService.expectReturn(
                r => r.checkConditions(null, [
                    [{
                        count: 3,
                        op: enum_.RelationOperator.gt,
                        valueType: 1,
                    }]
                ]),
                true
            );

            mockUserValueService.expectReturn(
                r => r.checkConditions(null, [
                    [{
                        count: 1,
                        op: enum_.RelationOperator.gt,
                        valueType: 1,
                    }]
                ]),
                false
            );

            mockUserValueService.expectReturn(
                r => r.getCount(null, 1),
                10
            );

            const fn = Reflect.get(self, 'initTime').bind(self) as (_: IUnitOfWork) => Promise<void>;
            await fn(null);

            strictEqual(self.closeOn, 11);
            strictEqual(self.hideOn, 12);
            strictEqual(self.openOn, 13);
        });
    });
});
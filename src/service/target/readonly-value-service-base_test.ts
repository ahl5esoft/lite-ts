import { deepStrictEqual, strictEqual } from 'assert';

import { TargetReadonlyValueServiceBase } from './readonly-value-service-base';
import { Mock } from '..';
import { DbFactoryBase, DbRepositoryBase, IAssociateStorageService, ITargetValueChangeData, ITargetValueData, IUnitOfWork, IValueConditionData, StringGeneratorBase } from '../..';
import { enum_ } from '../../model';

class TargetValue implements ITargetValueData {
    public id: string;
    public values: { [key: number]: number };
}

class TargetValueChange implements ITargetValueChangeData {
    public count: number;
    public id: string;
    public targetID: string;
    public valueType: number;
}

class Self extends TargetReadonlyValueServiceBase<TargetValue, TargetValueChange> {
    protected createChangeEntry() {
        return {
            targetID: this.targetID
        } as TargetValueChange;
    }
}

describe('src/service/target/readonly-value-service-base.ts', () => {
    describe('.checkConditions(uow: IUnitOfWork, conditions: IValueConditionData[])', () => {
        it('=', async () => {
            const self = new Self(null, null, null, null, null, null);

            Reflect.set(self, 'getCount', (_: IUnitOfWork, valueType: number) => {
                strictEqual(valueType, 1);
                return 11;
            });

            const res = await self.checkConditions(null, [{
                count: 11,
                op: enum_.RelationOperator.eq,
                valueType: 1
            }]);
            strictEqual(res, true);
        });

        it('>=', async () => {
            const self = new Self(null, null, null, null, null, null);

            Reflect.set(self, 'getCount', (_: IUnitOfWork, valueType: number) => {
                strictEqual(valueType, 1);
                return 11;
            });

            const res = await self.checkConditions(null, [{
                count: 11,
                op: enum_.RelationOperator.ge,
                valueType: 1
            }]);
            strictEqual(res, true);
        });

        it('>', async () => {
            const self = new Self(null, null, null, null, null, null);

            Reflect.set(self, 'getCount', (_: IUnitOfWork, valueType: number) => {
                strictEqual(valueType, 1);
                return 12;
            });

            const res = await self.checkConditions(null, [{
                count: 11,
                op: enum_.RelationOperator.gt,
                valueType: 1
            }]);
            strictEqual(res, true);
        });

        it('<=', async () => {
            const self = new Self(null, null, null, null, null, null);

            Reflect.set(self, 'getCount', (_: IUnitOfWork, valueType: number) => {
                strictEqual(valueType, 1);
                return 11;
            });

            const res = await self.checkConditions(null, [{
                count: 11,
                op: enum_.RelationOperator.le,
                valueType: 1
            }]);
            strictEqual(res, true);
        });

        it('<', async () => {
            const self = new Self(null, null, null, null, null, null);

            Reflect.set(self, 'getCount', (_: IUnitOfWork, valueType: number) => {
                strictEqual(valueType, 1);
                return 10;
            });

            const res = await self.checkConditions(null, [{
                count: 11,
                op: enum_.RelationOperator.lt,
                valueType: 1
            }]);
            strictEqual(res, true);
        });

        it('all', async () => {
            const self = new Self(null, null, null, null, null, null);

            const counts = {
                1: 11,
                2: 22,
                3: 33
            }
            Reflect.set(self, 'getCount', (_: IUnitOfWork, valueType: number) => {
                return counts[valueType];
            });

            const res = await self.checkConditions(null, [{
                count: 11,
                op: enum_.RelationOperator.eq,
                valueType: 1
            }, {
                count: 20,
                op: enum_.RelationOperator.gt,
                valueType: 2
            }, {
                count: 35,
                op: enum_.RelationOperator.lt,
                valueType: 3
            }]);
            strictEqual(res, true);
        });

        it('some', async () => {
            const self = new Self(null, null, null, null, null, null);

            const counts = {
                1: 11,
                2: 22,
                3: 33
            }
            Reflect.set(self, 'getCount', (_: IUnitOfWork, valueType: number) => {
                return counts[valueType];
            });

            const res = await self.checkConditions(null, [{
                count: 9,
                op: enum_.RelationOperator.eq,
                valueType: 1
            }, {
                count: 20,
                op: enum_.RelationOperator.gt,
                valueType: 2
            }, {
                count: 35,
                op: enum_.RelationOperator.lt,
                valueType: 3
            }]);
            strictEqual(res, false);
        });
    });

    describe('.enough(uow: IUnitOfWork, values: IValueData[])', () => {
        it('ok', async () => {
            const self = new Self(null, null, null, null, null, null);

            Reflect.set(self, 'checkConditions', (_: IUnitOfWork, res: IValueConditionData[]) => {
                deepStrictEqual(res, [{
                    count: 11,
                    op: enum_.RelationOperator.ge,
                    valueType: 1
                }, {
                    count: 22,
                    op: enum_.RelationOperator.ge,
                    valueType: 2
                }]);
            });

            await self.enough(null, [{
                count: -11,
                valueType: 1
            }, {
                count: 22,
                valueType: 2
            }]);
        });
    });

    describe('.getCount(_: IUnitOfWork, valueType: number)', () => {
        it('ok', async () => {
            const mockStorageService = new Mock<IAssociateStorageService>();
            const targetID = 't-id';
            const self = new Self(mockStorageService.actual, null, null, targetID, TargetValue, TargetValueChange);

            mockStorageService.expectReturn(
                r => r.find(TargetValue, 'id', targetID),
                [{
                    values: {
                        1: 11
                    }
                }]
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 11);
        });

        it('不存在', async () => {
            const mockStorageService = new Mock<IAssociateStorageService>();
            const targetID = 't-id';
            const self = new Self(mockStorageService.actual, null, null, targetID, TargetValue, TargetValueChange);

            mockStorageService.expectReturn(
                r => r.find(TargetValue, 'id', targetID),
                []
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });
    });

    describe('.update(uow: IUnitOfWork, ...values: IValueData[])', () => {
        it('ok', async () => {
            const mockStorageService = new Mock<IAssociateStorageService>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const targetID = 't-id';
            const self = new Self(mockStorageService.actual, mockDbFactory.actual, mockStringGenerator.actual, targetID, TargetValue, TargetValueChange);

            const mockDbRepo = new Mock<DbRepositoryBase<TargetValueChange>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValueChange, null),
                mockDbRepo.actual
            );

            const changeID = 'change-id';
            mockStringGenerator.expectReturn(
                r => r.generate(),
                changeID
            );

            mockDbRepo.expected.add({
                count: 11,
                id: changeID,
                targetID: targetID,
                valueType: 1,
            });

            await self.update(null, [{
                count: 11,
                valueType: 1
            }]);
        });
    });
});
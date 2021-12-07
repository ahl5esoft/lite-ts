import { deepStrictEqual, strictEqual } from 'assert';

import { TargetValueServiceBase } from './value-service-base';
import { IUnitOfWork, IValueConditionData, IValueData } from '../..';
import { enum_ } from '../../model';

class Self extends TargetValueServiceBase {
    public constructor(private m_Values: { [key: number]: number }) {
        super();
    }

    public async getCount(_: IUnitOfWork, valueType: number) {
        return this.m_Values[valueType] || 0;
    }

    public async update(_: IUnitOfWork, __: IValueData[]) { }
}

describe('src/service/target/value-service-base.ts', () => {
    describe('.checkConditions(uow: IUnitOfWork, conditions: IValueConditionData[])', () => {
        it('=', async () => {
            const self = new Self({
                1: 11
            });

            const res = await self.checkConditions(null, [{
                count: 11,
                op: enum_.RelationOperator.eq,
                valueType: 1
            }]);
            strictEqual(res, true);
        });

        it('>=', async () => {
            const self = new Self({
                1: 11
            });

            const res = await self.checkConditions(null, [{
                count: 11,
                op: enum_.RelationOperator.ge,
                valueType: 1
            }]);
            strictEqual(res, true);
        });

        it('>', async () => {
            const self = new Self({
                1: 12
            });

            const res = await self.checkConditions(null, [{
                count: 11,
                op: enum_.RelationOperator.gt,
                valueType: 1
            }]);
            strictEqual(res, true);
        });

        it('<=', async () => {
            const self = new Self({
                1: 11
            });

            const res = await self.checkConditions(null, [{
                count: 11,
                op: enum_.RelationOperator.le,
                valueType: 1
            }]);
            strictEqual(res, true);
        });

        it('<', async () => {
            const self = new Self({
                1: 10
            });

            const res = await self.checkConditions(null, [{
                count: 11,
                op: enum_.RelationOperator.lt,
                valueType: 1
            }]);
            strictEqual(res, true);
        });

        it('all', async () => {
            const self = new Self({
                1: 11,
                2: 22,
                3: 33
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
            const self = new Self({
                1: 11,
                2: 22,
                3: 33
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
            const self = new Self({});

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
});
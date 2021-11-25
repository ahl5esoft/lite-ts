import { strictEqual } from 'assert';

import { TargetReadonlyValueServiceBase } from './readonly-value-service-base';
import { Mock } from '..';
import { DbFactoryBase, DbRepositoryBase, ITargetStorageService, ITargetValueChangeData, ITargetValueData, StringGeneratorBase } from '../..';

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
    describe('.getCount(_: IUnitOfWork, valueType: number)', () => {
        it('ok', async () => {
            const mockStorageService = new Mock<ITargetStorageService>();
            const targetID = 't-id';
            const self = new Self(mockStorageService.actual, null, null, targetID, TargetValue, TargetValueChange);

            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValue, 'id', targetID),
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
            const mockStorageService = new Mock<ITargetStorageService>();
            const targetID = 't-id';
            const self = new Self(mockStorageService.actual, null, null, targetID, TargetValue, TargetValueChange);

            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValue, 'id', targetID),
                []
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });
    });

    describe('.update(uow: IUnitOfWork, ...values: IValueData[])', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const targetID = 't-id';
            const self = new Self(null, mockDbFactory.actual, mockStringGenerator.actual, targetID, TargetValue, TargetValueChange,);

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

            await self.update(null, {
                count: 11,
                valueType: 1
            });
        });
    });
});
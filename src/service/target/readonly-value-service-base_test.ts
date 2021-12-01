import { strictEqual } from 'assert';

import { TargetReadonlyValueServiceBase } from './readonly-value-service-base';
import { Mock } from '..';
import { DbFactoryBase, DbRepositoryBase, IAssociateStorageService, ITargetValueChangeData, ITargetValueData, StringGeneratorBase } from '../..';

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
            const self = new Self();
            self.model = TargetValue;
            self.targetID = 't-id';

            const mockStorageService = new Mock<IAssociateStorageService>();
            self.associateStorageService = mockStorageService.actual;

            mockStorageService.expectReturn(
                r => r.find(TargetValue, 'id', self.targetID),
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
            const self = new Self();
            self.model = TargetValue;
            self.targetID = 't-id';

            const mockStorageService = new Mock<IAssociateStorageService>();
            self.associateStorageService = mockStorageService.actual;

            mockStorageService.expectReturn(
                r => r.find(TargetValue, 'id', self.targetID),
                []
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });
    });

    describe('.update(uow: IUnitOfWork, ...values: IValueData[])', () => {
        it('ok', async () => {
            const self = new Self();
            self.changeModel = TargetValueChange;
            self.model = TargetValue;
            self.targetID = 't-id';

            const mockStorageService = new Mock<IAssociateStorageService>();
            self.associateStorageService = mockStorageService.actual;

            const mockDbFactory = new Mock<DbFactoryBase>();
            self.dbFactory = mockDbFactory.actual;

            const mockDbRepo = new Mock<DbRepositoryBase<TargetValueChange>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValueChange, null),
                mockDbRepo.actual
            );

            const mockStringGenerator = new Mock<StringGeneratorBase>();
            self.stringGenerator = mockStringGenerator.actual;

            const changeID = 'change-id';
            mockStringGenerator.expectReturn(
                r => r.generate(),
                changeID
            );

            mockDbRepo.expected.add({
                count: 11,
                id: changeID,
                targetID: self.targetID,
                valueType: 1,
            });

            await self.update(null, {
                count: 11,
                valueType: 1
            });
        });
    });
});
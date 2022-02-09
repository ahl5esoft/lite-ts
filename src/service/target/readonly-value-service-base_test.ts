import { TargetReadonlyValueServiceBase } from './readonly-value-service-base';
import { Mock } from '..';
import {
    DbFactoryBase,
    DbRepositoryBase,
    IAssociateStorageService,
    ITargetValueChangeData,
    ITargetValueData,
    IValueData,
    IValueTypeData,
    StringGeneratorBase
} from '../..';

class TargetValue implements ITargetValueData {
    public id: string;
    public values: { [key: number]: number };
}

class TargetValueChange implements ITargetValueChangeData {
    public count: number;
    public id: string;
    public source: string;
    public targetID: string;
    public valueType: number;
}

class ValueTypeData implements IValueTypeData {
    public value: number;
    public dailyTime?: number;
    public isReplace?: boolean;
}

class Self extends TargetReadonlyValueServiceBase<TargetValue, TargetValueChange, ValueTypeData> {
    public entry: any;

    private m_TargetID: string;
    public set targetID(v: string) {
        this.m_TargetID = v;
    }

    protected createChangeEntry() {
        return {
            targetID: this.m_TargetID
        } as TargetValueChange;
    }
}

describe('src/service/target/readonly-value-service-base.ts', () => {
    describe('.update(uow: IUnitOfWork, values: IValueData[])', () => {
        it('ok', async () => {
            const mockStorageService = new Mock<IAssociateStorageService>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const self = new Self(mockStorageService.actual, mockDbFactory.actual, mockStringGenerator.actual, TargetValueChange, null, null);

            const targetID = 't-id';
            self.targetID = targetID;

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

            const valueData = {
                count: 11,
                source: 'test',
                valueType: 1
            } as IValueData;
            mockDbRepo.expected.add({
                count: valueData.count,
                id: changeID,
                source: valueData.source,
                targetID: targetID,
                valueType: valueData.valueType,
            });

            mockStorageService.expected.add(TargetValueChange, {
                count: valueData.count,
                id: changeID,
                source: valueData.source,
                targetID: targetID,
                valueType: valueData.valueType,
            });

            await self.update(null, [valueData]);
        });
    });
});
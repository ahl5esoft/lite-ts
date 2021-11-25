import { strictEqual } from 'assert';
import moment from 'moment';

import { TargetValueServiceBase } from './value-service';
import { Mock, mockAny } from '..';
import {
    DbFactoryBase,
    DbRepositoryBase,
    IEnum,
    IEnumItem,
    ITargetStorageService,
    ITargetValueChangeData,
    ITargetValueData,
    ITargetValueLogData,
    IValueTypeData,
    NowTimeBase,
    StringGeneratorBase,
} from '../..';

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

class TargetValueLog implements ITargetValueLogData {
    public count: number;
    public createdOn: number;
    public id: string;
    public oldCount: number;
    public targetID: string;
    public valueType: number;
}

class ValueTypeData implements IValueTypeData {
    public value: number;
    public isReplace?: boolean;
    public todayTime?: number;
}

class Self extends TargetValueServiceBase<TargetValue, TargetValueChange, TargetValueLog, ValueTypeData> {
    protected createEntry() {
        return {} as TargetValue;
    }

    protected createChangeEntry() {
        return {
            targetID: this.targetID
        } as TargetValueChange;
    }

    protected createLogEntry() {
        return {
            targetID: this.targetID
        } as TargetValueLog;
    }
}

describe('src/service/target/value-service.ts', () => {
    describe('.getCount(uow: IUnitOfWork, valueType: number)', () => {
        it('ITargetValueData不存在', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockStorageService = new Mock<ITargetStorageService>();
            const targetID = 't-id';
            const chagneAssociateColumn = 'target-id'
            const self = new Self(null, null, chagneAssociateColumn, TargetValueLog, mockStorageService.actual, mockDbFactory.actual, null, targetID, TargetValue, TargetValueChange);

            const mockValueDbRepo = new Mock<DbRepositoryBase<TargetValue>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValue, null),
                mockValueDbRepo.actual
            );

            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValue, 'id', targetID),
                []
            );

            const targetValueEntry = {
                id: targetID,
                values: {}
            };
            mockValueDbRepo.expected.add(targetValueEntry);

            mockStorageService.expected.addAssociate(TargetValue, 'id', targetValueEntry);

            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValueChange, chagneAssociateColumn, targetID),
                []
            );

            const mockChangeDbRepo = new Mock<DbRepositoryBase<TargetValueChange>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValueChange, null),
                mockChangeDbRepo.actual
            );

            const mockLogDbRepo = new Mock<DbRepositoryBase<TargetValueLog>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValueLog, null),
                mockLogDbRepo.actual
            );

            mockStorageService.expected.clear(TargetValueChange, targetID);

            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValue, 'id', targetID),
                []
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });

        it('IValueTypeData.isReplace = true', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockValueType = new Mock<IEnum<ValueTypeData>>();
            const mockNowTime = new Mock<NowTimeBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const mockStorageService = new Mock<ITargetStorageService>();
            const targetID = 't-id';
            const chagneAssociateColumn = 'target-id'
            const self = new Self(mockValueType.actual, mockNowTime.actual, chagneAssociateColumn, TargetValueLog, mockStorageService.actual, mockDbFactory.actual, mockStringGenerator.actual, targetID, TargetValue, TargetValueChange);

            const mockValueDbRepo = new Mock<DbRepositoryBase<TargetValue>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValue, null),
                mockValueDbRepo.actual
            );

            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValue, 'id', targetID),
                []
            );

            const targetValueEntry = {
                id: targetID,
                values: {}
            };
            mockValueDbRepo.expected.add(targetValueEntry);

            mockStorageService.expected.addAssociate(TargetValue, 'id', targetValueEntry);

            const changeEntry = {
                count: 11,
                valueType: 1
            } as TargetValueChange;
            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValueChange, chagneAssociateColumn, targetID),
                [changeEntry]
            );

            const mockChangeDbRepo = new Mock<DbRepositoryBase<TargetValueChange>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValueChange, null),
                mockChangeDbRepo.actual
            );

            const mockLogDbRepo = new Mock<DbRepositoryBase<TargetValueLog>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValueLog, null),
                mockLogDbRepo.actual
            );

            mockChangeDbRepo.expected.remove(changeEntry);

            const nowUnix = moment().unix();
            mockNowTime.expectReturn(
                r => r.unix(),
                nowUnix
            );

            const logID = 'log-id';
            mockStringGenerator.expectReturn(
                r => r.generate(),
                logID
            );

            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValue, 'id', targetID),
                [{
                    values: {
                        1: 10
                    }
                }]
            );

            const mockValueTypeItem = new Mock<IEnumItem<ValueTypeData>>({
                data: {
                    isReplace: true
                }
            });
            mockValueType.expectReturn(
                r => r.get(mockAny),
                mockValueTypeItem.actual
            );

            mockLogDbRepo.expected.add({
                count: 11,
                createdOn: nowUnix,
                id: logID,
                oldCount: 10,
                targetID: targetID,
                valueType: 1
            });

            mockValueDbRepo.expected.save({
                id: targetID,
                values: {
                    1: 11
                }
            });

            mockStorageService.expected.clear(TargetValueChange, targetID);

            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValue, 'id', targetID),
                []
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });

        it('IValueTypeData.todayTime', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockValueType = new Mock<IEnum<ValueTypeData>>();
            const mockNowTime = new Mock<NowTimeBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const mockStorageService = new Mock<ITargetStorageService>();
            const targetID = 't-id';
            const chagneAssociateColumn = 'target-id'
            const self = new Self(mockValueType.actual, mockNowTime.actual, chagneAssociateColumn, TargetValueLog, mockStorageService.actual, mockDbFactory.actual, mockStringGenerator.actual, targetID, TargetValue, TargetValueChange);

            const mockValueDbRepo = new Mock<DbRepositoryBase<TargetValue>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValue, null),
                mockValueDbRepo.actual
            );

            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValue, 'id', targetID),
                []
            );

            const targetValueEntry = {
                id: targetID,
                values: {}
            };
            mockValueDbRepo.expected.add(targetValueEntry);

            mockStorageService.expected.addAssociate(TargetValue, 'id', targetValueEntry);

            const changeEntry = {
                count: 11,
                valueType: 1
            } as TargetValueChange;
            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValueChange, chagneAssociateColumn, targetID),
                [changeEntry]
            );

            const mockChangeDbRepo = new Mock<DbRepositoryBase<TargetValueChange>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValueChange, null),
                mockChangeDbRepo.actual
            );

            const mockLogDbRepo = new Mock<DbRepositoryBase<TargetValueLog>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValueLog, null),
                mockLogDbRepo.actual
            );

            mockChangeDbRepo.expected.remove(changeEntry);

            const nowUnix = moment().unix();
            mockNowTime.expectReturn(
                r => r.unix(),
                nowUnix
            );

            const logID = 'log-id';
            mockStringGenerator.expectReturn(
                r => r.generate(),
                logID
            );

            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValue, 'id', targetID),
                [{
                    values: {
                        1: 10
                    }
                }]
            );

            const mockValueTypeItem = new Mock<IEnumItem<ValueTypeData>>({
                data: {
                    todayTime: 2
                }
            });
            mockValueType.expectReturn(
                r => r.get(mockAny),
                mockValueTypeItem.actual
            );

            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValue, 'id', targetID),
                [{
                    values: {
                        2: nowUnix - 1
                    }
                }]
            );

            mockLogDbRepo.expected.add({
                count: 11,
                createdOn: nowUnix,
                id: logID,
                oldCount: 10,
                targetID: targetID,
                valueType: 1
            });

            mockValueDbRepo.expected.save({
                id: targetID,
                values: {
                    1: 11,
                    2: nowUnix
                }
            });

            mockStorageService.expected.clear(TargetValueChange, targetID);

            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValue, 'id', targetID),
                []
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });


        it('IValueTypeData不存在', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockValueType = new Mock<IEnum<ValueTypeData>>();
            const mockNowTime = new Mock<NowTimeBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const mockStorageService = new Mock<ITargetStorageService>();
            const targetID = 't-id';
            const chagneAssociateColumn = 'target-id'
            const self = new Self(mockValueType.actual, mockNowTime.actual, chagneAssociateColumn, TargetValueLog, mockStorageService.actual, mockDbFactory.actual, mockStringGenerator.actual, targetID, TargetValue, TargetValueChange);

            const mockValueDbRepo = new Mock<DbRepositoryBase<TargetValue>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValue, null),
                mockValueDbRepo.actual
            );

            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValue, 'id', targetID),
                []
            );

            const targetValueEntry = {
                id: targetID,
                values: {}
            };
            mockValueDbRepo.expected.add(targetValueEntry);

            mockStorageService.expected.addAssociate(TargetValue, 'id', targetValueEntry);

            const changeEntry = {
                count: 11,
                valueType: 1
            } as TargetValueChange;
            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValueChange, chagneAssociateColumn, targetID),
                [changeEntry]
            );

            const mockChangeDbRepo = new Mock<DbRepositoryBase<TargetValueChange>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValueChange, null),
                mockChangeDbRepo.actual
            );

            const mockLogDbRepo = new Mock<DbRepositoryBase<TargetValueLog>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValueLog, null),
                mockLogDbRepo.actual
            );

            mockChangeDbRepo.expected.remove(changeEntry);

            const nowUnix = moment().unix();
            mockNowTime.expectReturn(
                r => r.unix(),
                nowUnix
            );

            const logID = 'log-id';
            mockStringGenerator.expectReturn(
                r => r.generate(),
                logID
            );

            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValue, 'id', targetID),
                [{
                    values: {
                        1: 10
                    }
                }]
            );

            mockValueType.expectReturn(
                r => r.get(mockAny),
                null
            );

            mockLogDbRepo.expected.add({
                count: 11,
                createdOn: nowUnix,
                id: logID,
                oldCount: 10,
                targetID: targetID,
                valueType: 1
            });

            mockValueDbRepo.expected.save({
                id: targetID,
                values: {
                    1: 11
                }
            });

            mockStorageService.expected.clear(TargetValueChange, targetID);

            mockStorageService.expectReturn(
                r => r.findAssociates(TargetValue, 'id', targetID),
                []
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });
    });
});
import { strictEqual } from 'assert';
import moment from 'moment';

import { TargetValueServiceBase } from './value-service';
import { Mock, mockAny } from '..';
import {
    DbFactoryBase,
    DbRepositoryBase,
    IAssociateStorageService,
    IEnum,
    IEnumItem,
    ITargetValueChangeData,
    ITargetValueData,
    ITargetValueLogData,
    IValueInterceptorService,
    IValueTypeData,
    MissionSubjectBase,
    NowTimeBase,
    StringGeneratorBase,
    ValueInterceptorFactoryBase,
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
            const self = new Self();
            self.changeAssociateColumn = 'target-id';
            self.changeModel = TargetValueChange;
            self.logModel = TargetValueLog;
            self.model = TargetValue;
            self.targetID = 't-id';

            const mockDbFactory = new Mock<DbFactoryBase>();
            self.dbFactory = mockDbFactory.actual;

            const mockValueDbRepo = new Mock<DbRepositoryBase<TargetValue>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValue, null),
                mockValueDbRepo.actual
            );

            const mockStorageService = new Mock<IAssociateStorageService>();
            self.associateStorageService = mockStorageService.actual;

            mockStorageService.expectReturn(
                r => r.find(TargetValue, 'id', self.targetID),
                []
            );

            const targetValueEntry = {
                id: self.targetID,
                values: {}
            };
            mockValueDbRepo.expected.add(targetValueEntry);

            mockStorageService.expected.add(TargetValue, 'id', targetValueEntry);

            mockStorageService.expectReturn(
                r => r.find(TargetValueChange, self.changeAssociateColumn, self.targetID),
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

            mockStorageService.expected.clear(TargetValueChange, self.targetID);

            mockStorageService.expectReturn(
                r => r.find(TargetValue, 'id', self.targetID),
                []
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });

        it('IValueTypeData.isReplace = true', async () => {
            const self = new Self();
            self.changeAssociateColumn = 'target-id';
            self.changeModel = TargetValueChange;
            self.logModel = TargetValueLog;
            self.model = TargetValue;
            self.targetType = 0;
            self.targetID = 't-id';

            const mockDbFactory = new Mock<DbFactoryBase>();
            self.dbFactory = mockDbFactory.actual;

            const mockValueDbRepo = new Mock<DbRepositoryBase<TargetValue>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValue, null),
                mockValueDbRepo.actual
            );

            const mockStorageService = new Mock<IAssociateStorageService>();
            self.associateStorageService = mockStorageService.actual;

            mockStorageService.expectReturn(
                r => r.find(TargetValue, 'id', self.targetID),
                []
            );

            const targetValueEntry = {
                id: self.targetID,
                values: {}
            };
            mockValueDbRepo.expected.add(targetValueEntry);

            mockStorageService.expected.add(TargetValue, 'id', targetValueEntry);

            const changeEntry = {
                count: 11,
                valueType: 1
            } as TargetValueChange;
            mockStorageService.expectReturn(
                r => r.find(TargetValueChange, self.changeAssociateColumn, self.targetID),
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

            const mockValueInterceptorFactory = new Mock<ValueInterceptorFactoryBase>();
            self.valueInterceptorFactory = mockValueInterceptorFactory.actual;

            const mockValueInterceptorService = new Mock<IValueInterceptorService>();
            mockValueInterceptorFactory.expectReturn(
                r => r.build(0, changeEntry.valueType),
                mockValueInterceptorService.actual
            );

            mockValueInterceptorService.expectReturn(
                r => r.before(null, self, changeEntry),
                false
            );

            const mockNowTime = new Mock<NowTimeBase>();
            self.nowTime = mockNowTime.actual;

            const nowUnix = moment().unix();
            mockNowTime.expectReturn(
                r => r.unix(),
                nowUnix
            );

            const mockStringGenerator = new Mock<StringGeneratorBase>();
            self.stringGenerator = mockStringGenerator.actual;

            const logID = 'log-id';
            mockStringGenerator.expectReturn(
                r => r.generate(),
                logID
            );

            mockStorageService.expectReturn(
                r => r.find(TargetValue, 'id', self.targetID),
                [{
                    values: {
                        1: 10
                    }
                }]
            );

            const mockValueType = new Mock<IEnum<ValueTypeData>>();
            self.valueTypeEnum = mockValueType.actual;

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
                targetID: self.targetID,
                valueType: 1
            });

            mockValueDbRepo.expected.save({
                id: self.targetID,
                values: {
                    1: 11
                }
            });

            mockValueInterceptorService.expected.after(null, self, changeEntry);

            const mockMissionSubject = new Mock<MissionSubjectBase>();
            self.missionSubject = mockMissionSubject.actual;

            mockMissionSubject.expected.notify(null, self, changeEntry.valueType);

            mockStorageService.expected.clear(TargetValueChange, self.targetID);

            mockStorageService.expectReturn(
                r => r.find(TargetValue, 'id', self.targetID),
                []
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });

        it('IValueTypeData.todayTime', async () => {
            const self = new Self();
            self.changeAssociateColumn = 'target-id';
            self.changeModel = TargetValueChange;
            self.logModel = TargetValueLog;
            self.model = TargetValue;
            self.targetType = 0;
            self.targetID = 't-id';

            const mockDbFactory = new Mock<DbFactoryBase>();
            self.dbFactory = mockDbFactory.actual;

            const mockValueDbRepo = new Mock<DbRepositoryBase<TargetValue>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValue, null),
                mockValueDbRepo.actual
            );

            const mockStorageService = new Mock<IAssociateStorageService>();
            self.associateStorageService = mockStorageService.actual;

            mockStorageService.expectReturn(
                r => r.find(TargetValue, 'id', self.targetID),
                []
            );

            const targetValueEntry = {
                id: self.targetID,
                values: {}
            };
            mockValueDbRepo.expected.add(targetValueEntry);

            mockStorageService.expected.add(TargetValue, 'id', targetValueEntry);

            const changeEntry = {
                count: 11,
                valueType: 1
            } as TargetValueChange;
            mockStorageService.expectReturn(
                r => r.find(TargetValueChange, self.changeAssociateColumn, self.targetID),
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

            const mockValueInterceptorFactory = new Mock<ValueInterceptorFactoryBase>();
            self.valueInterceptorFactory = mockValueInterceptorFactory.actual;

            const mockValueInterceptorService = new Mock<IValueInterceptorService>();
            mockValueInterceptorFactory.expectReturn(
                r => r.build(0, changeEntry.valueType),
                mockValueInterceptorService.actual
            );

            mockValueInterceptorService.expectReturn(
                r => r.before(null, self, changeEntry),
                false
            );

            const mockNowTime = new Mock<NowTimeBase>();
            self.nowTime = mockNowTime.actual;

            const nowUnix = moment().unix();
            mockNowTime.expectReturn(
                r => r.unix(),
                nowUnix
            );

            const mockStringGenerator = new Mock<StringGeneratorBase>();
            self.stringGenerator = mockStringGenerator.actual;

            const logID = 'log-id';
            mockStringGenerator.expectReturn(
                r => r.generate(),
                logID
            );

            mockStorageService.expectReturn(
                r => r.find(TargetValue, 'id', self.targetID),
                [{
                    values: {
                        1: 10
                    }
                }]
            );

            const mockValueType = new Mock<IEnum<ValueTypeData>>();
            self.valueTypeEnum = mockValueType.actual;

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
                r => r.find(TargetValue, 'id', self.targetID),
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
                targetID: self.targetID,
                valueType: 1
            });

            mockValueDbRepo.expected.save({
                id: self.targetID,
                values: {
                    1: 11,
                    2: nowUnix
                }
            });

            mockValueInterceptorService.expected.after(null, self, changeEntry);

            const mockMissionSubject = new Mock<MissionSubjectBase>();
            self.missionSubject = mockMissionSubject.actual;

            mockMissionSubject.expected.notify(null, self, changeEntry.valueType);

            mockStorageService.expected.clear(TargetValueChange, self.targetID);

            mockStorageService.expectReturn(
                r => r.find(TargetValue, 'id', self.targetID),
                []
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });

        it('IValueTypeData不存在', async () => {
            const self = new Self();
            self.changeAssociateColumn = 'target-id';
            self.changeModel = TargetValueChange;
            self.logModel = TargetValueLog;
            self.model = TargetValue;
            self.targetType = 0;
            self.targetID = 't-id';

            const mockDbFactory = new Mock<DbFactoryBase>();
            self.dbFactory = mockDbFactory.actual;

            const mockValueDbRepo = new Mock<DbRepositoryBase<TargetValue>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValue, null),
                mockValueDbRepo.actual
            );

            const mockStorageService = new Mock<IAssociateStorageService>();
            self.associateStorageService = mockStorageService.actual;

            mockStorageService.expectReturn(
                r => r.find(TargetValue, 'id', self.targetID),
                []
            );

            const targetValueEntry = {
                id: self.targetID,
                values: {}
            };
            mockValueDbRepo.expected.add(targetValueEntry);

            mockStorageService.expected.add(TargetValue, 'id', targetValueEntry);

            const changeEntry = {
                count: 11,
                valueType: 1
            } as TargetValueChange;
            mockStorageService.expectReturn(
                r => r.find(TargetValueChange, self.changeAssociateColumn, self.targetID),
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

            const mockValueInterceptorFactory = new Mock<ValueInterceptorFactoryBase>();
            self.valueInterceptorFactory = mockValueInterceptorFactory.actual;

            const mockValueInterceptorService = new Mock<IValueInterceptorService>();
            mockValueInterceptorFactory.expectReturn(
                r => r.build(0, changeEntry.valueType),
                mockValueInterceptorService.actual
            );

            mockValueInterceptorService.expectReturn(
                r => r.before(null, self, changeEntry),
                false
            );

            const mockNowTime = new Mock<NowTimeBase>();
            self.nowTime = mockNowTime.actual;

            const nowUnix = moment().unix();
            mockNowTime.expectReturn(
                r => r.unix(),
                nowUnix
            );

            const mockStringGenerator = new Mock<StringGeneratorBase>();
            self.stringGenerator = mockStringGenerator.actual;

            const logID = 'log-id';
            mockStringGenerator.expectReturn(
                r => r.generate(),
                logID
            );

            mockStorageService.expectReturn(
                r => r.find(TargetValue, 'id', self.targetID),
                [{
                    values: {
                        1: 10
                    }
                }]
            );

            const mockValueType = new Mock<IEnum<ValueTypeData>>();
            self.valueTypeEnum = mockValueType.actual;

            mockValueType.expectReturn(
                r => r.get(mockAny),
                null
            );

            mockLogDbRepo.expected.add({
                count: 11,
                createdOn: nowUnix,
                id: logID,
                oldCount: 10,
                targetID: self.targetID,
                valueType: 1
            });

            mockValueDbRepo.expected.save({
                id: self.targetID,
                values: {
                    1: 11
                }
            });

            mockValueInterceptorService.expected.after(null, self, changeEntry);

            const mockMissionSubject = new Mock<MissionSubjectBase>();
            self.missionSubject = mockMissionSubject.actual;

            mockMissionSubject.expected.notify(null, self, changeEntry.valueType);

            mockStorageService.expected.clear(TargetValueChange, self.targetID);

            mockStorageService.expectReturn(
                r => r.find(TargetValue, 'id', self.targetID),
                []
            );

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });
    });
});
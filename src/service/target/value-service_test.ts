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
    private m_ChagneEntries: TargetValueChange[];
    public set changeEntries(v: TargetValueChange[]) {
        this.changeEntries = v;
    }

    private m_Entry: TargetValue;
    public set entry(v: TargetValue) {
        this.m_Entry = v;
    }

    protected clearChangeEntries() {
        this.associateStorageService.clear(TargetValueChange, r => {
            return r.targetID == this.m_Entry.id;
        });
    }

    protected createEntry() {
        return {} as TargetValue;
    }

    protected createChangeEntry() {
        return {
            targetID: this.m_Entry.id
        } as TargetValueChange;
    }

    protected createLogEntry() {
        return {
            targetID: this.m_Entry.id
        } as TargetValueLog;
    }

    protected async findChangeEntries() {
        return this.m_ChagneEntries;
    }

    protected async getEntry() {
        return this.m_Entry;
    }
}

describe('src/service/target/value-service.ts', () => {
    describe('.getCount(uow: IUnitOfWork, valueType: number)', () => {
        it('ITargetValueData不存在', async () => {
            const mockStorageService = new Mock<IAssociateStorageService>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(null, null, null, null, 0, TargetValue, TargetValueLog, mockStorageService.actual, mockDbFactory.actual, null, TargetValueChange);

            const mockValueDbRepo = new Mock<DbRepositoryBase<TargetValue>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValue, null),
                mockValueDbRepo.actual
            );

            const targetValueEntry = {} as TargetValue;
            mockValueDbRepo.expected.add(targetValueEntry);

            mockStorageService.expected.add(TargetValue, targetValueEntry);

            Reflect.set(self, 'findChangeEntries', () => {
                return [];
            });

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

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });

        it('IValueTypeData.isReplace = true', async () => {
            const mockStorageService = new Mock<IAssociateStorageService>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockMissionSubject = new Mock<MissionSubjectBase>();
            const mockNowTime = new Mock<NowTimeBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const mockValueInterceptorFactory = new Mock<ValueInterceptorFactoryBase>();
            const mockValueType = new Mock<IEnum<ValueTypeData>>();
            const self = new Self(
                mockValueType.actual,
                mockMissionSubject.actual,
                mockNowTime.actual,
                mockValueInterceptorFactory.actual,
                1,
                TargetValue,
                TargetValueLog,
                mockStorageService.actual,
                mockDbFactory.actual,
                mockStringGenerator.actual,
                TargetValueChange
            );

            const targetValueEntry = {
                id: 't-id',
                values: {
                    1: 10
                }
            };
            self.entry = targetValueEntry;

            const mockValueDbRepo = new Mock<DbRepositoryBase<TargetValue>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValue, null),
                mockValueDbRepo.actual
            );

            const changeEntry = {
                count: 11,
                valueType: 1
            } as TargetValueChange;
            Reflect.set(self, 'findChangeEntries', () => {
                return [changeEntry];
            });

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

            const mockValueInterceptorService = new Mock<IValueInterceptorService>();
            mockValueInterceptorFactory.expectReturn(
                r => r.build(1, changeEntry.valueType),
                mockValueInterceptorService.actual
            );

            mockValueInterceptorService.expectReturn(
                r => r.before(null, self, changeEntry),
                false
            );

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
                targetID: targetValueEntry.id,
                valueType: 1
            });

            mockValueInterceptorService.expected.after(null, self, changeEntry);

            mockMissionSubject.expected.notify(null, self, changeEntry.valueType);

            Reflect.set(self, 'clearChangeEntries', () => { });

            mockValueDbRepo.expected.save({
                id: targetValueEntry.id,
                values: {
                    1: 11
                }
            });

            const res = await self.getCount(null, 1);
            strictEqual(res, 11);
        });

        it('IValueTypeData.todayTime', async () => {
            const mockStorageService = new Mock<IAssociateStorageService>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockMissionSubject = new Mock<MissionSubjectBase>();
            const mockNowTime = new Mock<NowTimeBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const mockValueInterceptorFactory = new Mock<ValueInterceptorFactoryBase>();
            const mockValueType = new Mock<IEnum<ValueTypeData>>();
            const self = new Self(
                mockValueType.actual,
                mockMissionSubject.actual,
                mockNowTime.actual,
                mockValueInterceptorFactory.actual,
                1,
                TargetValue,
                TargetValueLog,
                mockStorageService.actual,
                mockDbFactory.actual,
                mockStringGenerator.actual,
                TargetValueChange
            );

            const targetValueEntry = {
                id: 't-id',
                values: {
                    1: 10
                }
            };
            self.entry = targetValueEntry;

            const mockValueDbRepo = new Mock<DbRepositoryBase<TargetValue>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValue, null),
                mockValueDbRepo.actual
            );

            const changeEntry = {
                count: 11,
                valueType: 1
            } as TargetValueChange;
            Reflect.set(self, 'findChangeEntries', () => {
                return [changeEntry];
            });

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

            const mockValueInterceptorService = new Mock<IValueInterceptorService>();
            mockValueInterceptorFactory.expectReturn(
                r => r.build(1, changeEntry.valueType),
                mockValueInterceptorService.actual
            );

            mockValueInterceptorService.expectReturn(
                r => r.before(null, self, changeEntry),
                false
            );

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

            const mockValueTypeItem = new Mock<IEnumItem<ValueTypeData>>({
                data: {
                    todayTime: 2
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
                targetID: targetValueEntry.id,
                valueType: 1
            });

            mockValueInterceptorService.expected.after(null, self, changeEntry);

            mockMissionSubject.expected.notify(null, self, changeEntry.valueType);

            Reflect.set(self, 'clearChangeEntries', () => { });

            mockValueDbRepo.expected.save({
                id: targetValueEntry.id,
                values: {
                    1: 11,
                    2: nowUnix
                }
            });

            const res = await self.getCount(null, 1);
            strictEqual(res, 11);
        });

        it('IValueTypeData不存在', async () => {
            const mockStorageService = new Mock<IAssociateStorageService>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockMissionSubject = new Mock<MissionSubjectBase>();
            const mockNowTime = new Mock<NowTimeBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const mockValueInterceptorFactory = new Mock<ValueInterceptorFactoryBase>();
            const mockValueType = new Mock<IEnum<ValueTypeData>>();
            const self = new Self(
                mockValueType.actual,
                mockMissionSubject.actual,
                mockNowTime.actual,
                mockValueInterceptorFactory.actual,
                1,
                TargetValue,
                TargetValueLog,
                mockStorageService.actual,
                mockDbFactory.actual,
                mockStringGenerator.actual,
                TargetValueChange
            );

            const targetValueEntry = {
                id: 't-id',
                values: {
                    1: 10
                }
            };
            self.entry = targetValueEntry;

            const mockValueDbRepo = new Mock<DbRepositoryBase<TargetValue>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValue, null),
                mockValueDbRepo.actual
            );

            const changeEntry = {
                count: 11,
                valueType: 1
            } as TargetValueChange;
            Reflect.set(self, 'findChangeEntries', () => {
                return [changeEntry];
            });

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

            const mockValueInterceptorService = new Mock<IValueInterceptorService>();
            mockValueInterceptorFactory.expectReturn(
                r => r.build(1, changeEntry.valueType),
                mockValueInterceptorService.actual
            );

            mockValueInterceptorService.expectReturn(
                r => r.before(null, self, changeEntry),
                false
            );

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

            mockValueType.expectReturn(
                r => r.get(mockAny),
                null,
            );

            mockLogDbRepo.expected.add({
                count: 21,
                createdOn: nowUnix,
                id: logID,
                oldCount: 10,
                targetID: targetValueEntry.id,
                valueType: 1
            });

            mockValueInterceptorService.expected.after(null, self, changeEntry);

            mockMissionSubject.expected.notify(null, self, changeEntry.valueType);

            Reflect.set(self, 'clearChangeEntries', () => { });

            mockValueDbRepo.expected.save({
                id: targetValueEntry.id,
                values: {
                    1: 21
                }
            });

            const res = await self.getCount(null, 1);
            strictEqual(res, 21);
        });
    });
});
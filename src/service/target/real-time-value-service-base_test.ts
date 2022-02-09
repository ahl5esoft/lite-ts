import { deepStrictEqual, strictEqual } from 'assert';

import { TargetRealTimeValueServiceBase } from './real-time-value-service-base';
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
    IUnitOfWork,
    IValueData,
    IValueInterceptor,
    IValueTypeData,
    NowTimeBase,
    StringGeneratorBase,
    ValueInterceptorFactoryBase,
} from '../..';
import moment from 'moment';

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

class TargetValueLog implements ITargetValueLogData {
    public count: number;
    public id: string;
    public oldCount: number;
    public source: string;
    public targetID: string;
    public valueType: number;
}

class ValueTypeData implements IValueTypeData {
    public value: number;
    public isReplace?: boolean;
    public todayTime?: number;
}

class Self extends TargetRealTimeValueServiceBase<TargetValue, TargetValueChange, TargetValueLog, ValueTypeData> {
    public entry: any;

    private m_ChagneEntries: TargetValueChange[];
    public set changeEntries(v: TargetValueChange[]) {
        this.changeEntries = v;
    }

    protected createEntry() {
        return {} as TargetValue;
    }

    protected createChangeEntry() {
        return {
            targetID: this.entry.id
        } as TargetValueChange;
    }

    protected createLogEntry() {
        return {
            targetID: this.entry.id
        } as TargetValueLog;
    }

    protected async findAndClearChangeEntries() {
        const changeEntries = this.m_ChagneEntries;
        this.changeEntries = [];
        return changeEntries;
    }
}

describe('src/service/target/real-time-value-service-base.ts', () => {
    describe('.getCount(uow: IUnitOfWork, valueType: number)', () => {
        it('ok', async () => {
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(null, mockDbFactory.actual, null, null, 1, TargetValue, TargetValueChange, TargetValueLog, null, null);

            Reflect.set(self, 'findChangeEntries', () => {
                return [{}];
            });

            const mockDbRepo = new Mock<DbRepositoryBase<TargetValueChange>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValueChange, null),
                mockDbRepo.actual
            );

            mockDbRepo.expected.remove({} as TargetValueChange);

            Reflect.set(self, 'update', (_: IUnitOfWork, res: IValueData[]) => {
                deepStrictEqual(res, [{}]);
            });

            Reflect.set(self, 'getCount', () => {
                return 0;
            });

            const res = await self.getCount(null, 1);
            strictEqual(res, 0);
        });
    });

    describe('.update(uow: IUnitOfWork, values: IValueData[])', () => {
        it('ITargetValueData不存在', async () => {
            const mockAssociateStorageService = new Mock<IAssociateStorageService>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const self = new Self(mockAssociateStorageService.actual, mockDbFactory.actual, null, null, 1, TargetValue, TargetValueChange, TargetValueLog, null, null);

            Reflect.set(self, 'getEntry', () => { });

            const mockValueDbRepo = new Mock<DbRepositoryBase<TargetValue>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValue, null),
                mockValueDbRepo.actual
            );

            let isCalledCreateEntry = false;
            Reflect.set(self, 'createEntry', () => {
                isCalledCreateEntry = true;
                return {};
            });

            const targetValueEntry = {
                values: {}
            } as TargetValue;
            mockValueDbRepo.expected.add(targetValueEntry);

            mockAssociateStorageService.expected.add(TargetValue, targetValueEntry);

            const mockLogDbRepo = new Mock<DbRepositoryBase<TargetValueLog>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValueLog, null),
                mockLogDbRepo.actual
            );

            mockValueDbRepo.expected.save({
                values: {}
            } as TargetValue);

            await self.update(null, []);

            strictEqual(isCalledCreateEntry, true);
        });

        it('IValueTypeData.isReplace = true', async () => {
            const mockAssociateStorageService = new Mock<IAssociateStorageService>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const mockValueType = new Mock<IEnum<ValueTypeData>>();
            const mockValueInterceptorFactory = new Mock<ValueInterceptorFactoryBase>();
            const self = new Self(mockAssociateStorageService.actual, mockDbFactory.actual, mockStringGenerator.actual, mockValueInterceptorFactory.actual, 1, TargetValue, TargetValueChange, TargetValueLog, mockValueType.actual, null);

            const entry = {
                id: 'uid',
                values: {
                    1: 10
                }
            } as TargetValue;
            self.entry = entry;

            const mockValueDbRepo = new Mock<DbRepositoryBase<TargetValue>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValue, null),
                mockValueDbRepo.actual
            );

            const mockLogDbRepo = new Mock<DbRepositoryBase<TargetValueLog>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValueLog, null),
                mockLogDbRepo.actual
            );

            const valueChange = {
                count: 11,
                source: 'test',
                valueType: 1
            } as TargetValueChange;

            const mockValueInterceptor = new Mock<IValueInterceptor>();
            mockValueInterceptorFactory.expectReturn(
                r => r.build(1, valueChange.valueType),
                mockValueInterceptor.actual
            );

            mockValueInterceptor.expectReturn(
                r => r.before(null, self, valueChange),
                false
            );

            Reflect.set(self, 'createLogEntry', () => {
                return {};
            });

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
                id: logID,
                oldCount: 10,
                source: valueChange.source,
                valueType: 1
            } as TargetValueLog);

            mockValueInterceptor.expected.after(null, self, valueChange);

            mockValueDbRepo.expected.save({
                ...entry,
                values: {
                    1: 11
                }
            } as TargetValue);

            await self.update(null, [valueChange]);
        });

        it('IValueTypeData.dailyTime', async () => {
            const mockAssociateStorageService = new Mock<IAssociateStorageService>();
            const mockDbFactory = new Mock<DbFactoryBase>();
            const mockNowTime = new Mock<NowTimeBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const mockValueType = new Mock<IEnum<ValueTypeData>>();
            const mockValueInterceptorFactory = new Mock<ValueInterceptorFactoryBase>();
            const self = new Self(mockAssociateStorageService.actual, mockDbFactory.actual, mockStringGenerator.actual, mockValueInterceptorFactory.actual, 1, TargetValue, TargetValueChange, TargetValueLog, mockValueType.actual, mockNowTime.actual);

            const entry = {
                id: 'uid',
                values: {
                    1: 10
                }
            } as TargetValue;
            self.entry = entry;

            const mockValueDbRepo = new Mock<DbRepositoryBase<TargetValue>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValue, null),
                mockValueDbRepo.actual
            );

            const mockLogDbRepo = new Mock<DbRepositoryBase<TargetValueLog>>();
            mockDbFactory.expectReturn(
                r => r.db(TargetValueLog, null),
                mockLogDbRepo.actual
            );

            const valueChange = {
                count: 11,
                source: 'test',
                valueType: 1
            } as TargetValueChange;

            const mockValueInterceptor = new Mock<IValueInterceptor>();
            mockValueInterceptorFactory.expectReturn(
                r => r.build(1, valueChange.valueType),
                mockValueInterceptor.actual
            );

            mockValueInterceptor.expectReturn(
                r => r.before(null, self, valueChange),
                false
            );

            Reflect.set(self, 'createLogEntry', () => {
                return {};
            });

            const logID = 'log-id';
            mockStringGenerator.expectReturn(
                r => r.generate(),
                logID
            );

            const mockValueTypeItem = new Mock<IEnumItem<ValueTypeData>>({
                data: {
                    dailyTime: 2
                }
            });
            mockValueType.expectReturn(
                r => r.get(mockAny),
                mockValueTypeItem.actual
            );

            const nowUnix = moment().unix();
            mockNowTime.expectReturn(
                r => r.unix(),
                nowUnix
            );

            mockLogDbRepo.expected.add({
                count: 11,
                id: logID,
                oldCount: 10,
                source: valueChange.source,
                valueType: 1
            } as TargetValueLog);

            mockValueInterceptor.expected.after(null, self, valueChange);

            mockValueDbRepo.expected.save({
                ...entry,
                values: {
                    1: 11,
                    2: nowUnix
                }
            } as TargetValue);

            await self.update(null, [valueChange]);
        });
    });
});
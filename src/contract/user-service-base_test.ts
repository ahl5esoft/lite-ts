import { Mock } from '../service';
import { DbFactoryBase } from './db-factory-base';
import { EnumFactoryBase } from './enum-factory-base';
import { IUnitOfWork } from './i-unit-of-work';
import { IUserAssociateService } from './i-user-associate-service';
import { LockBase } from './lock-base';
import { RpcBase } from './rpc-base';
import { ThreadBase } from './thread-base';
import { UserServiceBase } from './user-service-base';
import { UserValueServiceBase } from './user-value-service-base';
import { ValueTypeServiceBase } from './value-type-service-base';

class Self extends UserServiceBase {
    public constructor(
        public valueService: UserValueServiceBase,
        associateService: IUserAssociateService,
        dbFactory: DbFactoryBase,
        enumFactory: EnumFactoryBase,
        lock: LockBase,
        rpc: RpcBase,
        thread: ThreadBase,
        valueTypeService: ValueTypeServiceBase,
        userID: string,
    ) {
        super(
            associateService,
            userID,
            dbFactory,
            enumFactory,
            lock,
            rpc,
            thread,
            valueTypeService,
            null,
        );
    }

    public getTargetValueService() {
        return null;
    }
}

describe('src/contract/user-service-base.ts', () => {
    describe('.waitLock(uow: IUnitOfWork, scene?: string)', () => {
        it('默认', async () => {
            const mockLock = new Mock<LockBase>();
            const mockThread = new Mock<ThreadBase>();
            const self = new Self(null, null, null, null, mockLock.actual, null, mockThread.actual, null, 'user-id');

            mockLock.expectReturn(
                r => r.lock('user-id', 10),
                null
            );

            mockThread.expected.sleepRange(100, 300);

            const unlock = async () => { };
            mockLock.expectReturn(
                r => r.lock('user-id', 10),
                unlock
            );

            const mockUow = new Mock<IUnitOfWork>();

            mockUow.expected.registerAfter(unlock);

            await self.waitLock(mockUow.actual);
        });

        it('场景', async () => {
            const mockLock = new Mock<LockBase>();
            const mockThread = new Mock<ThreadBase>();
            const self = new Self(null, null, null, null, mockLock.actual, null, mockThread.actual, null, 'user-id');

            mockLock.expectReturn(
                r => r.lock('user-id:test', 10),
                null
            );

            mockThread.expected.sleepRange(100, 300);

            const unlock = async () => { };
            mockLock.expectReturn(
                r => r.lock('user-id:test', 10),
                unlock
            );

            const mockUow = new Mock<IUnitOfWork>();

            mockUow.expected.registerAfter(unlock);

            await self.waitLock(mockUow.actual, 'test');
        });
    });
});
import { opentracing } from 'jaeger-client';

import { RpcUserValueService } from './user-value-service';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IUserAssociateService,
    NowTimeBase,
    RpcBase,
    ThreadBase,
    UserServiceBase,
    UserValueServiceBase,
} from '../../contract';
import { enum_ } from '../../model';

export class RpcUserService extends UserServiceBase {
    private m_ValueService: UserValueServiceBase;
    public get valueService() {
        this.m_ValueService ??= new RpcUserValueService(
            this.rpc,
            this.targetTypeData,
            this.enumFactory,
            this.nowTime,
            this,
            this.nowValueType,
        );
        return this.m_ValueService;
    }

    public constructor(
        protected nowTime: NowTimeBase,
        protected targetTypeData: enum_.TargetTypeData,
        protected nowValueType: number,
        associateService: IUserAssociateService,
        dbFactory: DbFactoryBase,
        enumFactory: EnumFactoryBase,
        rpc: RpcBase,
        thread: ThreadBase,
        parentTracerSpan: opentracing.Span,
        userID: string,
    ) {
        super(associateService, userID, dbFactory, enumFactory, rpc, thread, parentTracerSpan);
    }

    public async getTargetValueService() {
        return null;
    }
}
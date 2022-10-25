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
    ValueTypeServiceBase,
} from '../../contract';
import { enum_ } from '../../model';

/**
 * 用户服务(远程)
 */
export class RpcUserService extends UserServiceBase {
    private m_ValueService: UserValueServiceBase;
    public get valueService() {
        this.m_ValueService ??= new RpcUserValueService(
            this.rpc,
            this.m_TargetTypeData,
            this.enumFactory,
            this.nowTime,
            this,
            this.m_NowValueType,
        );
        return this.m_ValueService;
    }

    public constructor(
        protected nowTime: NowTimeBase,
        private m_TargetTypeData: enum_.TargetTypeData,
        private m_NowValueType: number,
        associateService: IUserAssociateService,
        dbFactory: DbFactoryBase,
        enumFactory: EnumFactoryBase,
        rpc: RpcBase,
        thread: ThreadBase,
        valueTypeService: ValueTypeServiceBase,
        parentTracerSpan: opentracing.Span,
        userID: string,
    ) {
        super(associateService, userID, dbFactory, enumFactory, rpc, thread, valueTypeService, parentTracerSpan);
    }

    public async getTargetValueService() {
        return null;
    }
}
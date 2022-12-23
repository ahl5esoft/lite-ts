import { opentracing } from 'jaeger-client';

import { RpcValueService } from './value-service';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IUserAssociateService,
    NowTimeBase,
    RpcBase,
    ThreadBase,
    UserServiceBase,
} from '../../contract';
import { enum_, global } from '../../model';

export class RpcUserService extends UserServiceBase {
    private m_ValueService: RpcValueService<global.UserValue>;
    public get valueService() {
        this.m_ValueService ??= new RpcValueService(
            this.rpc,
            this.targetTypeData,
            {
                userID: this.userID,
            },
            this.enumFactory,
            this,
            r => r.id == this.userID
        );
        return this.m_ValueService;
    }

    public constructor(
        protected targetTypeData: enum_.TargetTypeData,
        associateService: IUserAssociateService,
        dbFactory: DbFactoryBase,
        enumFactory: EnumFactoryBase,
        nowTime: NowTimeBase,
        rpc: RpcBase,
        thread: ThreadBase,
        nowValueType: number,
        parentTracerSpan: opentracing.Span,
        userID: string,
    ) {
        super(
            associateService,
            userID,
            dbFactory,
            enumFactory,
            nowTime,
            rpc,
            thread,
            nowValueType,
            parentTracerSpan,
        );
    }
}
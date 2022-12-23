import { opentracing } from 'jaeger-client';

import { DbUserValueService } from './user-value-service';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IUserAssociateService,
    NowTimeBase,
    RpcBase,
    StringGeneratorBase,
    ThreadBase,
    UserServiceBase,
    ValueInterceptorFactoryBase,
} from '../../contract';

export class DbUserService extends UserServiceBase {
    private m_ValueService: DbUserValueService;
    public get valueService() {
        this.m_ValueService ??= new DbUserValueService(
            this.rpc,
            this.dbFactory,
            this.enumFactory,
            this.stringGenerator,
            this,
            this.valueInterceptorFactory,
            this.parentTracerSpan,
        );
        return this.m_ValueService;
    }

    public constructor(
        protected stringGenerator: StringGeneratorBase,
        protected valueInterceptorFactory: ValueInterceptorFactoryBase,
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
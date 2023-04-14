import { opentracing } from 'jaeger-client';

import { DbUserValueService } from './user-value-service';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IUserAssociateService,
    MathBase,
    NowTimeBase,
    RedisBase,
    RpcBase,
    StringGeneratorBase,
    ThreadBase,
    UserServiceBase,
    ValueInterceptorFactoryBase,
    ValueServiceBase,
} from '../../contract';
import { global } from '../../model';

export class DbUserService extends UserServiceBase {
    private m_ValueService: ValueServiceBase<global.UserValue>;
    public get valueService() {
        this.m_ValueService ??= new DbUserValueService(
            this.rpc,
            this.dbFactory,
            this.enumFactory,
            this.m_Math,
            this.redis,
            this.stringGenerator,
            this,
            this.valueInterceptorFactory,
            this.parentTracerSpan,
        );
        return this.m_ValueService;
    }

    public constructor(
        private m_Math: MathBase,
        protected redis: RedisBase,
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
import { opentracing } from 'jaeger-client';

import { RpcValueService } from './value-service';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IUserAssociateService,
    MathBase,
    NowTimeBase,
    RpcBase,
    ThreadBase,
    UserServiceBase,
    ValueServiceBase,
} from '../../contract';
import { enum_, global } from '../../model';

export class RpcUserService extends UserServiceBase {
    private m_ValueService: ValueServiceBase<global.UserValue>;
    public get valueService() {
        this.m_ValueService ??= new RpcValueService(
            this.rpc,
            this.targetTypeData,
            {
                userID: this.userID,
            },
            this.enumFactory,
            this.m_Math,
            this,
            async () => {
                const entries = await this.associateService.find<global.UserValue>(global.UserValue.name, r => r.id == this.userID);
                return entries[0];
            }
        );
        return this.m_ValueService;
    }

    public constructor(
        private m_Math: MathBase,
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
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
    UserValueServiceBase,
    ValueInterceptorFactoryBase,
    ValueServiceBase,
} from '../../contract';
import { enum_, global } from '../../model';

export class DbUserService extends UserServiceBase {
    public static buildTargetValueServiceFunc: (
        enumFactory: EnumFactoryBase,
        rpc: RpcBase,
        userService: UserServiceBase,
        targetTypeData: enum_.TargetTypeData,
        userID: string,
    ) => ValueServiceBase<global.UserTargetValue>;

    private m_TargetTypeValueService: { [targetType: number]: ValueServiceBase<global.UserTargetValue> } = {};

    private m_ValueService: UserValueServiceBase;
    public get valueService() {
        this.m_ValueService ??= new DbUserValueService(
            this,
            this.dbFactory,
            this.stringGenerator,
            this.valueInterceptorFactory,
            this.parentTracerSpan,
            this.enumFactory,
            this.nowTime,
            this.nowValueType,
        );
        return this.m_ValueService;
    }

    public constructor(
        protected nowTime: NowTimeBase,
        protected stringGenerator: StringGeneratorBase,
        protected valueInterceptorFactory: ValueInterceptorFactoryBase,
        protected nowValueType: number,
        protected parentTracerSpan: opentracing.Span,
        associateService: IUserAssociateService,
        dbFactory: DbFactoryBase,
        enumFactory: EnumFactoryBase,
        rpc: RpcBase,
        thread: ThreadBase,
        userID: string,
    ) {
        super(associateService, userID, dbFactory, enumFactory, rpc, thread, parentTracerSpan);
    }

    public async getTargetValueService(targetType: number) {
        if (targetType == 0)
            throw new Error('无法用此方法获取用户数值服务');

        const allItem = await this.enumFactory.build(enum_.TargetTypeData).allItem;
        if (!allItem[targetType])
            throw new Error(`无效目标类型: ${targetType}`);

        this.m_TargetTypeValueService[targetType] ??= DbUserService.buildTargetValueServiceFunc(this.enumFactory, this.rpc, this, allItem[targetType].entry, this.userID);
        return this.m_TargetTypeValueService[targetType];
    }
}
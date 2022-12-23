import { opentracing } from 'jaeger-client';

import { DbValueService } from './value-service';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IUnitOfWork,
    RpcBase,
    StringGeneratorBase,
    UserServiceBase,
    ValueInterceptorFactoryBase,
    ValueServiceBase,
} from '../../contract';
import { contract, enum_, global } from '../../model';

export class DbUserValueService extends DbValueService<global.UserValue, global.UserValueChange, global.UserValueLog> {
    public static buildTargetValueServiceFunc: (
        enumFactory: EnumFactoryBase,
        rpc: RpcBase,
        userService: UserServiceBase,
        targetTypeData: enum_.TargetTypeData,
    ) => ValueServiceBase<global.UserTargetValue>;

    private m_TargetTypeValueService: { [targetType: number]: ValueServiceBase<global.UserTargetValue> } = {};

    public constructor(
        protected rpc: RpcBase,
        dbFactory: DbFactoryBase,
        enumFactory: EnumFactoryBase,
        stringGenerator: StringGeneratorBase,
        userService: UserServiceBase,
        valueInterceptorFactory: ValueInterceptorFactoryBase,
        parentTracerSpan: opentracing.Span,
    ) {
        super(
            dbFactory,
            stringGenerator,
            valueInterceptorFactory,
            parentTracerSpan,
            global.UserValueChange,
            () => {
                const entry = new global.UserValue();
                entry.id = userService.userID;
                return entry;
            },
            () => {
                const entry = new global.UserValueLog();
                entry.userID = userService.userID;
                return entry;
            },
            r => r.userID == userService.userID,
            userService,
            enumFactory,
            r => r.id == userService.userID,
        );
    }

    public async update(uow: IUnitOfWork, values: contract.IValue[]) {
        const tracerSpan = opentracing.globalTracer().startSpan('userValue.update', {
            childOf: this.parentTracerSpan,
        });

        const tasks = values.reduce((memo, r) => {
            r.targetType ??= 0;
            const item = memo.find(cr => {
                return cr.targetType == r.targetType;
            });
            if (item) {
                item.values.push(r);
            } else {
                memo.push({
                    values: [r],
                    targetType: r.targetType,
                });
            }
            return memo;
        }, [] as {
            values: contract.IValue[],
            targetType: number,
        }[]).map(async r => {
            if (r.targetType) {
                const allItem = await this.enumFactory.build(enum_.TargetTypeData).allItem;
                if (!allItem[r.targetType])
                    throw new Error(`${DbUserValueService.name}.update: 无效目标类型[${r.targetType}]`);

                this.m_TargetTypeValueService[r.targetType] ??= DbUserValueService.buildTargetValueServiceFunc(this.enumFactory, this.rpc, this.userService, allItem[r.targetType].entry);
                return this.m_TargetTypeValueService[r.targetType].update(uow, r.values);
            } else {
                return super.update(uow, r.values);
            }
        });
        await Promise.all(tasks);

        tracerSpan.finish();
    }
}
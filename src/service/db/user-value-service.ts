import { opentracing } from 'jaeger-client';

import { DbValueService } from './value-service';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IUnitOfWork,
    NowTimeBase,
    StringGeneratorBase,
    UserServiceBase,
    UserValueServiceBase,
    ValueInterceptorFactoryBase,
    ValueServiceBase,
} from '../../contract';
import { contract, global } from '../../model';

export class DbUserValueService extends UserValueServiceBase {
    private m_ValueService: ValueServiceBase<global.UserValue>;
    protected get valueService() {
        this.m_ValueService ??= new DbValueService<global.UserValue, global.UserValueChange, global.UserValueLog>(
            this.m_DbFactory,
            this.m_StringGenerator,
            this.userService,
            this.m_ValueInterceptorFactory,
            this.m_ParentTracerSpan,
            global.UserValueChange,
            () => {
                const entry = new global.UserValue();
                entry.id = this.userService.userID;
                return entry;
            },
            () => {
                const entry = new global.UserValueLog();
                entry.userID = this.userService.userID;
                return entry;
            },
            r => {
                return r.userID == this.userService.userID;
            },
            () => this.entry,
            this.enumFactory,
        );
        return this.m_ValueService;
    }

    public get entry() {
        return new Promise<global.UserValue>(async (s, f) => {
            try {
                const rows = await this.userService.associateService.find<global.UserValue>(global.UserValue.name, r => {
                    return r.id == this.userService.userID;
                });
                s(rows[0]);
            } catch (ex) {
                f(ex);
            }
        });
    }

    public constructor(
        public userService: UserServiceBase,
        private m_DbFactory: DbFactoryBase,
        private m_StringGenerator: StringGeneratorBase,
        private m_ValueInterceptorFactory: ValueInterceptorFactoryBase,
        private m_ParentTracerSpan: opentracing.Span,
        enumFactory: EnumFactoryBase,
        nowTime: NowTimeBase,
        nowValueType: number,
    ) {
        super(userService, nowTime, nowValueType, enumFactory);
    }

    public async getCount(uow: IUnitOfWork, valueType: number) {
        return this.valueService.getCount(uow, valueType);
    }

    public async update(uow: IUnitOfWork, values: contract.IValue[]) {
        const tracerSpan = this.m_ParentTracerSpan ? opentracing.globalTracer().startSpan('userValue.update', {
            childOf: this.m_ParentTracerSpan,
        }) : null;
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
                const targetValueService = await this.userService.getTargetValueService(r.targetType);
                return targetValueService.update(uow, r.values);
            } else {
                return this.valueService.update(uow, r.values);
            }
        });
        await Promise.all(tasks);
        tracerSpan?.finish?.();
    }
}
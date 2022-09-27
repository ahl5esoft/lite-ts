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

/**
 * 用户数值服务
 */
export class DbUserValueService extends UserValueServiceBase {
    private m_ValueService: ValueServiceBase<global.UserValue>;
    /**
     * 数值服务
     */
    protected get valueService() {
        this.m_ValueService ??= new DbValueService<global.UserValue, global.UserValueChange, global.UserValueLog>(
            this.m_DbFactory,
            this.m_StringGenerator,
            this.userService,
            this.m_ValueInterceptorFactory,
            this.m_ParentTracerSpan,
            global.UserValueChange,
            () => {
                return {
                    id: this.userService.userID
                } as global.UserValue;
            },
            () => {
                return {
                    userID: this.userService.userID
                } as global.UserValueLog;
            },
            r => {
                return r.userID == this.userService.userID;
            },
            () => this.entry,
            this.enumFactory,
        );
        return this.m_ValueService;
    }


    /**
     * 获取用户数值实体
     */
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

    /**
     * 构造函数
     * 
     * @param userService 用户服务
     * @param m_DbFactory 数据库工厂
     * @param m_StringGenerator 字符串生成器
     * @param m_ValueInterceptorFactory 数值拦截器工厂
     * @param m_ParentTracerSpan 父跟踪范围
     * @param enumFactory 枚举工厂
     * @param nowTime 当前时间
     * @param nowValueType 当前时间数值类型
     */
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

    /**
     * 获取数量
     * 
     * @param uow 工作单元
     * @param valueType 数值类型
     */
    public async getCount(uow: IUnitOfWork, valueType: number) {
        return this.valueService.getCount(uow, valueType);
    }

    /**
     * 更新数值
     * 
     * @param uow 工作单元
     * @param values 数值数组
     */
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
import { opentracing } from 'jaeger-client';
import moment from 'moment';

import { DbValueServiceBase } from './value-service-base';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IUnitOfWork,
    IUserValueService,
    NowTimeBase,
    StringGeneratorBase,
    UserServiceBase,
    ValueInterceptorFactoryBase,
} from '../../contract';
import { contract, global } from '../../model';

/**
 * 用户数值服务
 */
export class DbUserValueService extends DbValueServiceBase<
    global.UserValue,
    global.UserValueChange,
    global.UserValueLog
> implements IUserValueService {
    /**
     * 当前时间戳
     */
    private m_Now: [number, number];

    /**
     * 获取用户数值实体
     */
    public get entry() {
        return new Promise<global.UserValue>(async (s, f) => {
            try {
                const rows = await this.associateService.find<global.UserValue>(this.model.name, r => {
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
     * @param m_NowValueType 当前时间数值类型
     * @param dbFactory 数据库工厂
     * @param enumFactory 枚举工厂
     * @param nowTime 当前时间
     * @param stringGenerator 字符串生成器
     * @param valueInterceptorFactory 数值拦截器工厂
     * @param tracerSpan 跟踪范围
     */
    public constructor(
        public userService: UserServiceBase,
        private m_NowValueType: number,
        dbFactory: DbFactoryBase,
        enumFactory: EnumFactoryBase,
        nowTime: NowTimeBase,
        stringGenerator: StringGeneratorBase,
        valueInterceptorFactory: ValueInterceptorFactoryBase,
        tracerSpan: opentracing.Span,
    ) {
        super(
            userService?.associateService,
            dbFactory,
            stringGenerator,
            valueInterceptorFactory,
            tracerSpan,
            global.UserValue,
            global.UserValueChange,
            global.UserValueLog,
            enumFactory,
            nowTime,
        );
    }

    /**
     * 获取当前unix
     * 
     * @param uow 工作单元
     */
    public async getNow(uow: IUnitOfWork) {
        if (!this.m_Now) {
            this.m_Now = [
                await this.getCount(uow, this.m_NowValueType),
                moment().unix()
            ];
            if (!this.m_Now[0])
                this.m_Now[0] = await this.nowTime.unix();
        }

        return this.m_Now[0] + moment().unix() - this.m_Now[1];
    }

    /**
     * 更新数值
     * 
     * @param uow 工作单元
     * @param values 数值数组
     */
    public async update(uow: IUnitOfWork, values: contract.IValue[]) {
        const tracerSpan = this.tracerSpan ? opentracing.globalTracer().startSpan('userValue.update', {
            childOf: this.tracerSpan,
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
                return super.update(uow, r.values);
            }
        });
        await Promise.all(tasks);
        tracerSpan?.finish?.();
    }

    /**
     * 创建用户数值实体
     */
    protected createEntry() {
        return {
            id: this.userService.userID
        } as global.UserValue;
    }

    /**
     * 创建用户数值变更日志实体
     */
    protected createLogEntry() {
        return {
            userID: this.userService.userID
        } as global.UserValueLog;
    }

    /**
     * 查找并清除关联用户数值变更数据
     */
    protected async findAndClearChangeEntries() {
        return this.associateService.findAndClear<global.UserValueChange>(this.changeModel.name, r => {
            return r.userID == this.userService.userID;
        });
    }
}
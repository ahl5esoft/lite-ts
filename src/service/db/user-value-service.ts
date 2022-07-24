import { DbValueServiceBase } from './value-service-base';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IUnitOfWork,
    IUserValueService,
    NowTimeBase,
    StringGeneratorBase,
    UserServiceBase,
    ValueInterceptorFactoryBase
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
     */
    public constructor(
        public userService: UserServiceBase,
        private m_NowValueType: number,
        dbFactory: DbFactoryBase,
        enumFactory: EnumFactoryBase,
        nowTime: NowTimeBase,
        stringGenerator: StringGeneratorBase,
        valueInterceptorFactory: ValueInterceptorFactoryBase,
    ) {
        super(
            userService?.associateService,
            dbFactory,
            stringGenerator,
            valueInterceptorFactory,
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
        let now = await this.getCount(uow, this.m_NowValueType);
        if (!now)
            now = await this.nowTime.unix();

        return now;
    }

    /**
     * 根据奖励更新数值
     * 
     * @param uow 工作单元
     * @param rewards 奖励
     * @param source 来源
     */
    public async updateByRewards(uow: IUnitOfWork, source: string, rewards: contract.IReward[][]) {
        let res: contract.IValue[] = [];
        for (const r of rewards) {
            if (!r.length)
                continue;

            let rewardData: contract.IReward;
            if (r.length == 1) {
                rewardData = r[0];
            } else {
                const total = r.reduce((memo, r) => {
                    return memo + r.weight * 1;
                }, 0);
                let rand = Math.floor(
                    Math.random() * total
                );
                rewardData = r.find(cr => {
                    rand -= cr.weight;
                    return rand <= 0;
                });
            }
            res.push({
                count: rewardData.count,
                source: rewardData.source ?? source,
                valueType: rewardData.valueType
            });
        }

        if (res.length)
            await this.update(uow, res);

        return res;
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
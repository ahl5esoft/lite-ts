import moment from 'moment';

import { EnumFactoryBase } from './enum-factory-base';
import { IUnitOfWork } from './i-unit-of-work';
import { NowTimeBase } from './now-time-base';
import { UserServiceBase } from './user-service-base';
import { ValueServiceBase } from './value-service-base';
import { contract, global } from '../model';

/**
 * 用户数值服务
 */
export abstract class UserValueServiceBase extends ValueServiceBase<global.UserValue> {
    /**
     * 实体
     */
    public get entry() {
        return new Promise<global.UserValue>(async (s, f) => {
            try {
                const entries = await this.userService.associateService.find<global.UserValue>(global.UserValue.name, r => {
                    return r.id == this.userService.userID;
                });
                s(entries[0]);
            } catch (ex) {
                f(ex);
            }
        });
    }

    private m_Now: [number, number];
    /**
     * 获取当前时间
     */
    public get now() {
        return new Promise<number>(async (s, f) => {
            const nowUnix = moment().unix();
            if (!this.m_Now) {
                try {
                    const entry = await this.entry;
                    const temp: [number, number] = [
                        entry?.values?.[this.m_NowValueType] ?? 0,
                        nowUnix
                    ];
                    if (!temp[0])
                        temp[0] = await this.nowTime.unix();

                    this.m_Now = temp;
                } catch (ex) {
                    return f(ex);
                }
            }

            s(this.m_Now[0] + nowUnix - this.m_Now[1]);
        });
    }

    /**
     * 构造函数
     * 
     * @param userService 用户服务
     * @param nowTime 当前时间
     * @param m_NowValueType 当前数值类型
     * @param enumFactory 枚举工厂
     */
    public constructor(
        public userService: UserServiceBase,
        protected nowTime: NowTimeBase,
        private m_NowValueType: number,
        enumFactory: EnumFactoryBase,
    ) {
        super(enumFactory);
    }

    /**
     * 更新
     * 
     * @param uow 工作单元
     * @param values 数值数组
     */
    public abstract update(uow: IUnitOfWork, values: contract.IValue[]): Promise<void>;
}
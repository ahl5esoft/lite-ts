import { RpcUserValueService } from './user-value-service';
import {
    DbFactoryBase,
    EnumFactoryBase,
    IUserAssociateService,
    IUserValueService,
    LockBase,
    NowTimeBase,
    RpcBase,
    ThreadBase,
    UserServiceBase,
    ValueTypeServiceBase,
} from '../../contract';
import { enum_ } from '../../model';

/**
 * 用户服务(远程)
 */
export class RpcUserService extends UserServiceBase {
    private m_ValueService: IUserValueService;
    /**
     * 数值服务
     */
    public get valueService() {
        if (!this.m_ValueService) {
            this.m_ValueService = new RpcUserValueService(
                this,
                this.rpc,
                this.m_TargetTypeData,
                this.m_NowValueType,
                this.enumFactory,
                this.nowTime,
            );
        }

        return this.m_ValueService;
    }

    /**
     * 构造函数
     * 
     * @param nowTime 当前时间
     * @param m_NowValueType 当前时间数值类型
     * @param associateService 关联服务
     * @param dbFactory 数据库工厂
     * @param enumFactory 枚举工厂
     * @param lock 锁
     * @param rpc 远程过程调用
     * @param thread 锁
     * @param valueTypeService 数值类型服务
     * @param userID 用户ID
     */
    public constructor(
        protected nowTime: NowTimeBase,
        private m_TargetTypeData: enum_.TargetTypeData,
        private m_NowValueType: number,
        associateService: IUserAssociateService,
        dbFactory: DbFactoryBase,
        enumFactory: EnumFactoryBase,
        lock: LockBase,
        rpc: RpcBase,
        thread: ThreadBase,
        valueTypeService: ValueTypeServiceBase,
        userID: string,
    ) {
        super(associateService, userID, dbFactory, enumFactory, lock, rpc, thread, valueTypeService);
    }

    /**
     * 获取目标数值服务
     */
    public async getTargetValueService() {
        return null;
    }
}
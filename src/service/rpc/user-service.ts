import { RpcUserValueService } from './user-value-service';
import {
    EnumFactoryBase,
    IUserAssociateService,
    IUserService,
    IUserValueService,
    NowTimeBase,
    RpcBase,
} from '../../contract';
import { enum_ } from '../../model';

/**
 * 用户服务(远程)
 */
export class RpcUserService implements IUserService {
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
     * @param associateService 关联服务
     * @param userID 用户ID
     * @param enumFactory 枚举工厂
     * @param nowTime 当前时间
     * @param rpc 远程过程调用
     * @param m_NowValueType 当前时间数值类型
     */
    public constructor(
        public associateService: IUserAssociateService,
        public userID: string,
        protected enumFactory: EnumFactoryBase,
        protected nowTime: NowTimeBase,
        protected rpc: RpcBase,
        private m_TargetTypeData: enum_.TargetTypeData,
        private m_NowValueType: number,
    ) { }

    /**
     * 获取目标数值服务
     */
    public async getTargetValueService() {
        return null;
    }
}
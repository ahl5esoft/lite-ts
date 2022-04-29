import { RpcUserValueService } from './user-value-service';
import {
    EnumFactoryBase,
    ITargetValueService,
    IUserAssociateService,
    NowTimeBase,
    RpcBase,
} from '../../contract';
import { global } from '../../model';

/**
 * 用户服务(远程)
 */
export class RpcUserService {
    /**
     * 关联键
     */
    public static associateKey = 'user-value';

    private m_ValueService: ITargetValueService<global.TargetValue>;
    /**
     * 数值服务
     */
    public get valueService() {
        if (!this.m_ValueService) {
            this.m_ValueService = new RpcUserValueService(
                this.associateService,
                this.rpc,
                this.userID,
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
     */
    public constructor(
        public associateService: IUserAssociateService,
        public userID: string,
        protected enumFactory: EnumFactoryBase,
        protected nowTime: NowTimeBase,
        protected rpc: RpcBase,
    ) { }
}
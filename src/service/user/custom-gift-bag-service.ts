import { DbFactoryBase, IUnitOfWork, IUserCustomGiftBagService } from '../../contract';
import { global } from '../../model';

/**
 * 用户自选礼包服务
 */
export class UserCustomGiftBagService implements IUserCustomGiftBagService {
    /**
     * 自选结果, { 礼包编号: 自选编号 }
     */
    public get custom() {
        return this.m_Entry[this.m_Scene] ?? {};
    }

    private m_Scene: string;
    /**
     * 场景
     */
    public set scene(v: string) {
        this.m_Scene = v;
    }

    /**
     * 构造函数
     * 
     * @param m_DbFactory 数据库工厂
     * @param m_Entry 实体
     */
    public constructor(
        private m_DbFactory: DbFactoryBase,
        private m_Entry: global.UserCustomGiftBag,
    ) { }

    /**
     * 选择
     * 
     * @param uow 工作单元
     * @param giftBagNo 礼包编号
     * @param customIndex 自选编号
     */
    public async choose(uow: IUnitOfWork, giftBagNo: number, customIndex: number) {
        this.m_Entry.giftBag[this.m_Scene] ??= {};
        this.m_Entry.giftBag[this.m_Scene][giftBagNo] = customIndex;
        await this.m_DbFactory.db(global.UserCustomGiftBag, uow).save(this.m_Entry);
    }
}
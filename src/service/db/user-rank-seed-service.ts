import { DbFactoryBase, IUnitOfWork, IUserAssociateService, IUserRandSeedService } from '../../contract';
import { global } from '../../model';

/**
 * 用户随机种子服务
 */
export class DbUserRandSeedService implements IUserRandSeedService {
    /**
     * 构造函数
     * 
     * @param m_AssociateService 关联服务
     * @param m_DbFactory 数据库工厂
     * @param m_UserID 用户ID
     * @param m_Scene 场景
     * @param m_Range 区间, [最小长度, 最大长度]
     */
    public constructor(
        private m_AssociateService: IUserAssociateService,
        private m_DbFactory: DbFactoryBase,
        private m_Scene: string,
        private m_UserID: string,
        private m_Range: [number, number],
    ) { }

    /**
     * 获取
     * 
     * @param uow 工作单元
     * @param len 长度 
     * @param offset 偏移
     */
    public async get(uow: IUnitOfWork, len: number, offset?: number) {
        const seeds = await this.findSeeds(uow);
        offset ??= 0;
        if (len + offset >= seeds.length)
            throw new Error('种子已达最大值');

        return parseInt(
            seeds.splice(offset, len).join('')
        ) || 0;
    }

    /**
     * 使用
     * 
     * @param uow 工作单元
     * @param len 长度 
     */
    public async use(uow: IUnitOfWork, len: number) {
        const seeds = await this.findSeeds(uow);
        if (len >= seeds.length)
            throw new Error('种子已达最大值');

        const seed = parseInt(
            seeds.splice(0, len).join('')
        ) || 0;
        const entries = await this.m_AssociateService.find<global.UserRandSeed>(global.UserRandSeed.name, r => {
            return r.id == this.m_UserID;
        });
        entries[0].seed[this.m_Scene] = seeds.join('');
        await this.m_DbFactory.db(global.UserRandSeed, uow).save(entries[0]);
        return seed;
    }

    /**
     * 初始化
     * 
     * @param uow 工作单元
     */
    private async findSeeds(uow: IUnitOfWork) {
        const entries = await this.m_AssociateService.find<global.UserRandSeed>(global.UserRandSeed.name, r => {
            return r.id == this.m_UserID;
        });
        const db = this.m_DbFactory.db(global.UserRandSeed, uow);
        if (entries.length) {
            for (let i = 1; i < entries.length; i++) {
                await db.remove(entries[i]);
            }
        } else {
            entries.push({
                id: this.m_UserID,
                seed: {}
            });
            await db.add(entries[0]);
            this.m_AssociateService.add(global.UserRandSeed.name, entries[0]);
        }

        entries[0].seed[this.m_Scene] ??= '';
        if (entries[0].seed[this.m_Scene].length < this.m_Range[0]) {
            while (entries[0].seed[this.m_Scene].length < this.m_Range[1])
                entries[0].seed[this.m_Scene] += Math.random().toString(10).substring(2);

            await db.save(entries[0]);
        }

        return [...entries[0].seed[this.m_Scene]];
    }
}
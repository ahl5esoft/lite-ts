import { DbFactoryBase, IUnitOfWork, IUserCustomGiftBagService } from '../../contract';
import { global } from '../../model';

export class UserCustomGiftBagService implements IUserCustomGiftBagService {
    public get custom() {
        return this.entry[this.m_Scene] ?? {};
    }

    private m_Scene: string;
    public set scene(v: string) {
        this.m_Scene = v;
    }

    public constructor(
        protected dbFactory: DbFactoryBase,
        protected entry: global.UserCustomGiftBag,
    ) { }

    public async choose(uow: IUnitOfWork, giftBagNo: number, customIndex: number) {
        this.entry.giftBag[this.m_Scene] ??= {};
        this.entry.giftBag[this.m_Scene][giftBagNo] = customIndex;
        await this.dbFactory.db(global.UserCustomGiftBag, uow).save(this.entry);
    }
}
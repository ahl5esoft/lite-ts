import { DBFactoryBase, IEnum, IEnumItem } from '../..';
import { global } from '../../model';
import { EnumItem } from './enum-item';

export class Enum implements IEnum {
    private m_Items: IEnumItem[];

    public constructor(
        private m_DbFactory: DBFactoryBase,
        private m_Name: string
    ) { }

    public async all(): Promise<IEnumItem[]> {
        if (!this.m_Items) {
            const rows = await this.m_DbFactory.db(global.Enum).query().where({
                id: this.m_Name
            }).toArray();
            if (rows.length) {
                this.m_Items = rows[0].items.map(r => {
                    return new EnumItem(r, this.m_Name);
                });
            } else {
                this.m_Items = [];
            }
        }

        return this.m_Items;
    }

    public async get(predicate: (data: global.IEnumItemData) => boolean) {
        const items = await this.all();
        return items.find(r => {
            return predicate(r.data);
        });
    }
}
import { Length } from 'class-validator';
import { Inject, Service } from 'typedi';

import { APIBase } from '../../../api';
import { DbFactoryBase } from '../../../plugin/db';

class Doc {
    public id: string

    public name: string;
}

@Service()
export default class MongoAPI extends APIBase {
    @Inject()
    public dbFactory: DbFactoryBase;

    @Length(1, 20)
    public model: string;

    public async call(): Promise<any> {
        const uow = this.dbFactory.uow();
        const db = this.dbFactory.db<Doc>(Doc, uow);
        for (let i = 0; i < 5; i++) {
            await db.add({
                id: `id-${i}`,
                name: `name-${i}`
            });
        }
        await uow.commit();

        const rows = await db.query().toArray();

        for (const r of rows) {
            await db.remove(r);
        }
        await uow.commit();

        return rows;
    }
}
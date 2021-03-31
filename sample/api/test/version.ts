import { Inject, Service } from 'typedi';

import { APIBase, APICallerBase, DBFactoryBase, StringGeneratorBase } from '../../../src';

class Version {
    public createdOn: number;

    public id: string;

    public version: string;
}

@Service()
export default class VersionAPI extends APIBase {
    @Inject()
    public apiCaller: APICallerBase;

    @Inject()
    public dbFactory: DBFactoryBase;

    @Inject()
    public stringGenerator: StringGeneratorBase;

    protected async call() {
        const db = this.dbFactory.db<Version>(Version);
        await db.query().count();
        const entry: Version = {
            createdOn: 1,
            id: 'id-add',
            version: '0.0.1',
        };
        await db.add(entry);

        entry.createdOn = 2;
        entry.version = '0.0.2';
        await db.save(entry);

        await db.remove(entry);

        const uow = this.dbFactory.uow();
        const txDB = this.dbFactory.db<Version>(Version, uow);
        const entry2: Version = {
            createdOn: 1,
            id: 'id-tx',
            version: '0.0.1',
        };
        await txDB.add(entry2);
        await txDB.remove(entry2);
        await uow.commit();

        return '1.0.0';
    }
}
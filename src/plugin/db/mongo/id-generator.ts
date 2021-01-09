import { ObjectID } from 'mongodb';

import { IDGeneratorBase } from '../../../object';

export class MongoIDGenerator extends IDGeneratorBase {
    public async generate(): Promise<string> {
        return new ObjectID().toHexString();
    }
}

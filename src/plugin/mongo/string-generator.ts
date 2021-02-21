import { ObjectID } from 'mongodb';

import { StringGeneratorBase } from '../../object';

export class MongoStringGenerator extends StringGeneratorBase {
    public async generate(): Promise<string> {
        return new ObjectID().toHexString();
    }
}
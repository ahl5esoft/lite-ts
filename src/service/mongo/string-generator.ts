import { ObjectID } from 'mongodb';

import { StringGeneratorBase } from '../../contract';

export class MongoStringGenerator extends StringGeneratorBase {
    public async generate(): Promise<string> {
        return new ObjectID().toHexString();
    }
}
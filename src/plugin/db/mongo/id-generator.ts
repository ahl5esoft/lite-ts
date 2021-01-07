import { ObjectID } from 'mongodb';

import { IDGeneratorBase } from '../../../object';

export class IDGenerator extends IDGeneratorBase {
    public async generate(): Promise<string> {
        return new ObjectID().toHexString();
    }
}

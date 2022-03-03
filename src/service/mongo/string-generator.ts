import { ObjectID } from 'mongodb';

import { StringGeneratorBase } from '../..';

/**
 * mongo字符串生成器
 */
export class MongoStringGenerator extends StringGeneratorBase {
    /**
     * 生成ID
     */
    public async generate(): Promise<string> {
        return new ObjectID().toHexString();
    }
}
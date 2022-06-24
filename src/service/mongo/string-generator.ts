import { ObjectId } from 'mongodb';

import { StringGeneratorBase } from '../../contract';

/**
 * mongo字符串生成器
 */
export class MongoStringGenerator extends StringGeneratorBase {
    /**
     * 生成ID
     */
    public async generate(): Promise<string> {
        return new ObjectId().toHexString();
    }
}
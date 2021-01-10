import { Inject, Service } from 'typedi';

import { APIBase } from '../../../api';
import { RedisBase } from '../../../plugin/redis';

@Service()
export default class RedisAPI extends APIBase {
    @Inject()
    public redis: RedisBase;

    public async call(): Promise<[string, string]> {
        return this.redis.time();
    }
}
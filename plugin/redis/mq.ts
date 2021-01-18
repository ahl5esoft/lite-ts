import { MQBase } from '../mq';
import { RedisBase } from './base';

export class RedisMQ extends MQBase {
    public constructor(private m_Redis: RedisBase) {
        super();
    }

    public async publish(channel: string, message: any): Promise<void> {
        await this.m_Redis.publish(channel, message);
    }

    public async subscribe(channel: string, action: (message: string) => void): Promise<void> {
        await this.m_Redis.subscribe([channel], action);
    }
}
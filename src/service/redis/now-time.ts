import { NowTimeBase, RedisBase } from '../../contract';

export class RedisNowTime extends NowTimeBase {
    public constructor(private m_Redis: RedisBase) {
        super();
    }

    public async unixNano() {
        const res = await this.m_Redis.time();
        const complement = '0'.repeat(6 - res[1].length);
        return parseInt(`${res[0]}${res[1]}${complement}`) * 1000;
    }

    public async unix() {
        const res = await this.m_Redis.time();
        return parseInt(res[0]);
    }
}
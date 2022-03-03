import { NowTimeBase, RedisBase } from '../..';

/**
 * redis实现
 */
export class RedisNowTime extends NowTimeBase {
    /**
     * 构造函数
     * 
     * @param m_Redis redis
     */
    public constructor(private m_Redis: RedisBase) {
        super();
    }

    /**
     * @returns 时间戳(单位: s)
     */
    public async unix() {
        const res = await this.m_Redis.time();
        return parseInt(res[0]);
    }

    /**
     * @returns 时间戳(单位: 纳秒)
     */
    public async unixNano() {
        const res = await this.m_Redis.time();
        const complement = '0'.repeat(6 - res[1].length);
        return parseInt(`${res[0]}${res[1]}${complement}`) * 1000;
    }
}
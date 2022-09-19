import { TracerStrategy } from '../tracer';
import { ITraceable, LockBase, RedisBase } from '../../contract';

/**
 * redis锁
 */
export class RedisLock extends LockBase implements ITraceable<LockBase> {
    /**
     * 构造函数
     * 
     * @param m_Redis redis
     */
    public constructor(private m_Redis: RedisBase) {
        super();
    }

    /**
     * 加锁
     * 
     * @param key 键
     * @param seconds 秒数
     */
    public async lock(key: string, seconds: number) {
        const ok = await this.m_Redis.set(key, 'ok', 'ex', seconds, 'nx');
        return ok ? async () => {
            await this.m_Redis.del(key);
        } : null;
    }

    /**
     * 跟踪
     * 
     * @param parentSpan 父范围
     */
    public withTrace(parentSpan: any) {
        return parentSpan ? new RedisLock(
            new TracerStrategy(this.m_Redis).withTrace(parentSpan),
        ) : this;
    }
}

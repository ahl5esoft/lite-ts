import { TracerStrategy } from '../tracer';
import { ITraceable, MutexBase, RedisBase, ThreadBase } from '../../contract';

export class RedisMutex extends MutexBase implements ITraceable<MutexBase> {
    public constructor(
        private m_Redis: RedisBase,
        thread: ThreadBase,
    ) {
        super(thread);
    }

    public async lock(key: string, seconds: number) {
        const ok = await this.m_Redis.set(key, 'ok', 'ex', seconds, 'nx');
        return ok ? async () => {
            await this.m_Redis.del(key);
        } : null;
    }

    public withTrace(parentSpan: any) {
        return parentSpan ? new RedisMutex(
            new TracerStrategy(this.m_Redis).withTrace(parentSpan),
            this.thread,
        ) : this;
    }
}

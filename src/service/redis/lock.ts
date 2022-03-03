import { LockBase, RedisBase } from '../..';

export class RedisLock extends LockBase {
    public constructor(private m_Redis: RedisBase) {
        super();
    }

    public async lock(key: string, seconds: number): Promise<() => Promise<void>> {
        const ok = await this.m_Redis.set(key, 'ok', 'ex', seconds, 'nx');
        return ok ? async (): Promise<void> => {
            await this.m_Redis.del(key);
        } : null;
    }
}

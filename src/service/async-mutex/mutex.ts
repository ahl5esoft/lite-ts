import { Mutex } from 'async-mutex'

import { MutexBase } from '../../contract';

export class AsyncMutexMutex extends MutexBase {
    private m_Mutex = new Mutex();

    public async lock() {
        const unlock = await this.m_Mutex.acquire();
        return unlock as any;
    }
}
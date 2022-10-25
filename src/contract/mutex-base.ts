import { ThreadBase } from './thread-base';

interface IMutexWaitLockOption {
    key: string;
    timeoutSecond?: number;
    tryCount?: number;
    sleepRange?: [number, number];
}

export abstract class MutexBase {
    public static errWaitLock: Error;

    public constructor(
        protected thread: ThreadBase,
    ) { }

    public async waitLock(opt: IMutexWaitLockOption) {
        opt.sleepRange ??= [100, 300];
        opt.timeoutSecond ??= 10;
        opt.tryCount ??= 50;

        let unlock: () => Promise<void>;
        for (let i = 0; i < opt.tryCount; i++) {
            unlock = await this.lock(opt.key, 10);
            if (unlock)
                break;

            await this.thread.sleepRange(opt.sleepRange[0], opt.sleepRange[1]);
        }
        
        if (!unlock) {
            MutexBase.errWaitLock ??= new Error(`未配置${MutexBase.name}.errWaitLock`);
            throw MutexBase.errWaitLock;
        }

        return unlock;
    }

    public abstract lock(key: string, seconds: number): Promise<() => Promise<void>>;
}
import { LockBase } from '../../contract';

let isLock = false;
let lockQueue: Wait[] = [];

class Wait {
    resolve: (v: () => Promise<void>) => void;
    reject: (reason?: any) => void;
}

async function unlock() {
    let wait = lockQueue.shift();
    if (wait) {
        wait.resolve(unlock);
    } else {
        isLock = false;
    }
}

export class PromiseLock extends LockBase {
    public async lock(): Promise<() => Promise<void>> {
        if (isLock) {
            return new Promise((s, r) => {
                lockQueue.push({
                    resolve: s,
                    reject: r,
                });
            });
        } else {
            isLock = true;
            return unlock;
        }
    }
}
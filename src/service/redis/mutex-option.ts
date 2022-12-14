export class RedisMutexOption {
    key: string;
    timeoutSeconds?: number;
    tryCount?: number;
    sleepRange?: [number, number];
}
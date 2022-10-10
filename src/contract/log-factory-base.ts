import { ILog } from './i-log';

export abstract class LogFactoryBase {
    public abstract build(): ILog;
}
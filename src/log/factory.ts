import { LogBase } from './log-base';

export class LogFactory {
    public constructor(private m_BuildFunc: () => LogBase) {}

    public build(): LogBase {
        return this.m_BuildFunc();
    }
}
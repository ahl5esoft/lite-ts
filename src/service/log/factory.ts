import { LogBase } from '../../contract';

export class LogFactory {
    public constructor(private m_BuildFunc: () => LogBase) {}

    public build(): LogBase {
        return this.m_BuildFunc();
    }
}
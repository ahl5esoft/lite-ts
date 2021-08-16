import { LogBase } from '../../contract';

export class DefaultLogFactory {
    public constructor(private m_BuildFunc: () => LogBase) {}

    public build(): LogBase {
        return this.m_BuildFunc();
    }
}
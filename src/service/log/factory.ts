import { ILog, LogFactoryBase } from '../..';

export class LogFactory extends LogFactoryBase {
    public constructor(
        private m_BuildFuncs: { [key: number]: new () => ILog }
    ) {
        super();
    }

    public build(type: number) {
        if (this.m_BuildFuncs[type])
            return new this.m_BuildFuncs[type]();

        throw new Error(`无效ILog: ${type}`);
    }
}
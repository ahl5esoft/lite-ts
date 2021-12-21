import { IParser, ParserFactoryBase } from '../..';

export class ParserFactory extends ParserFactoryBase {
    public constructor(
        private m_BuildFuncs: { [type: string]: () => IParser }
    ) {
        super();
    }

    public build(type: string) {
        if (type in this.m_BuildFuncs)
            return this.m_BuildFuncs[type]();

        throw new Error(`缺少IParser: ${type}`);
    }
}
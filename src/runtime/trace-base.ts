import { StringGeneratorBase } from '../object';

export const traceKey = '$trace';
export const traceSpanKey = '$trace-span';

export abstract class TraceBase {
    public constructor(protected stringGenerator: StringGeneratorBase, private m_ID: string) { }

    public abstract createSpan(parentID: string): TraceSpanBase;

    public async getID(): Promise<string> {
        if (!this.m_ID)
            this.m_ID = await this.stringGenerator.generate();

        return this.m_ID;
    }
}

export abstract class TraceFactoryBase {
    public abstract build(traceID: string): TraceBase;
}

export abstract class TraceSpanBase {
    private m_ID: string;

    public constructor(private m_StringGenerator: StringGeneratorBase) { }

    public async getID(): Promise<string> {
        if (!this.m_ID)
            this.m_ID = await this.m_StringGenerator.generate();

        return this.m_ID;
    }

    public abstract addLabel(key: string, value: any): void;
    public abstract begin(name: string): Promise<void>;
    public abstract end(): Promise<void>;
}
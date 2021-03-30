export const traceKey = '$trace';
export const traceSpanKey = '$trace-span';

export abstract class TraceLogBase {
    public abstract createSpan(parentID: string): Promise<TraceLogSpanBase>;
}

export abstract class TraceLogFactoryBase {
    public abstract build(traceID: string): Promise<TraceLogBase>;
}

export abstract class TraceLogSpanBase {
    public abstract addLabel(key: string, value: any): void;
    public abstract begin(name: string): Promise<void>;
    public abstract end(): Promise<void>;
}
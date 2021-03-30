export const traceKey = '$trace';
export const traceSpanKey = '$trace-span';

export abstract class TraceBase {
    public abstract createSpan(parentID: string): Promise<TraceSpanBase>;
}

export abstract class TraceFactoryBase {
    public abstract build(traceID: string): Promise<TraceBase>;
}

export abstract class TraceSpanBase {
    public abstract addLabel(key: string, value: any): void;
    public abstract begin(name: string): Promise<void>;
    public abstract end(): Promise<void>;
}
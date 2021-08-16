export abstract class LogBase {
    protected labels: { [key: string]: any } = {};

    public addLabel(k: string, v: any): this {
        this.labels[k] = v;
        return this;
    }

    public abstract debug(): void;
    public abstract error(err: Error): void;
    public abstract info(): void;
    public abstract warning(): void;
}
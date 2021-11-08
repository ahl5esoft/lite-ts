export interface ILog {
    addLabel(k: string, v: any): this;
    debug(): void;
    error(err: Error): void;
    info(): void;
    warning(): void;
}
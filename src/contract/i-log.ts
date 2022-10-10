export interface ILog {
    addLabel(k: string, v: any): ILog;
    debug(): void;
    error(err: Error): void;
    info(): void;
    warning(): void;
}
export interface ICommand {
    exec(): Promise<string>;
    setDir(path: string): this;
    setExtra(v: any): this;
    setTimeout(ms: number): this;
}
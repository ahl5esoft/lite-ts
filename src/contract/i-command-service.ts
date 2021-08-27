export interface ICommandService {
    exec(): Promise<string>;
    setDir(v: string): this;
    setExtra(v: any): this;
    setTimeout(v: number): this;
}
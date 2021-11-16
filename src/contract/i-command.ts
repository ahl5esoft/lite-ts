import { ICommandResult } from './i-command-result';

export interface ICommand {
    exec(): Promise<ICommandResult>;
    setDir(path: string): this;
    setExtra(v: any): this;
    setTimeout(ms: number): this;
}
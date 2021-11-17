import { ICommand } from './i-command';

export abstract class CommandFactoryBase {
    public abstract build(type: number, ...cmdArgs: string[][]): ICommand;
}
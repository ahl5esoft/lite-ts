import { ICommand } from './i-command';

export abstract class CommandFactoryBase {
    public abstract build(...cmdArgs: string[][]): ICommand;
}
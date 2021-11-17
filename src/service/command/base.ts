import { ICommand, ICommandResult } from '../..';

export abstract class CommandBase implements ICommand {
    protected dir: string;
    protected extra: any;
    protected timeout: number;

    public setDir(v: string): this {
        this.dir = v;
        return this;
    }

    public setExtra(v: any): this {
        this.extra = v;
        return this;
    }

    public setTimeout(v: number): this {
        this.timeout = v;
        return this;
    }

    public abstract exec(): Promise<ICommandResult>;
}
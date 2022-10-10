import { ICommandOption } from './i-command-option';
import { ICommandResult } from './i-command-result';

export abstract class CommandBase {
    public abstract exec(v: ICommandOption): Promise<ICommandResult>;
}
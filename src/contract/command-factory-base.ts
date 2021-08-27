import { ICommandService } from './i-command-service';

export abstract class CommandFactoryBase {
    public abstract build(...cmdArgs: any[]): ICommandService;
}
import { CommandServiceBase } from './command-service-base';

export abstract class CommandFactoryBase {
    public abstract build(...cmdArgs: any[]): CommandServiceBase;
}
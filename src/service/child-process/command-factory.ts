import { CommandService } from './command-service';
import { CommandFactoryBase } from '../..';

export class CommandFactory extends CommandFactoryBase {
    public build(...cmdArgs: any[]) {
        return new CommandService(cmdArgs);
    }
}
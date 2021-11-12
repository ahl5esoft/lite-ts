import { Command } from './command';
import { CommandFactoryBase } from '../..';

export class ChildProcessCommandFactory extends CommandFactoryBase {
    public build(...cmdArgs: any[]) {
        return new Command(cmdArgs);
    }
}
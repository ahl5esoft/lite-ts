import { Command } from './command';
import { CommandFactoryBase } from '../..';

export class ChildProcessCommandFactory extends CommandFactoryBase {
    public build(...cmdArgs: string[][]) {
        return new Command(cmdArgs);
    }
}
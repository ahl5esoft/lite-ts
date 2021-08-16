import { CommandFactoryBase, CommandServiceBase } from '../../contract';

export class DefaultCommandFactory extends CommandFactoryBase {
    public constructor(private m_BuildCmdFunc: (args: any[]) => CommandServiceBase) {
        super();
    }

    public build(...cmdArgs: any[]) {
        return this.m_BuildCmdFunc(cmdArgs);
    }
}
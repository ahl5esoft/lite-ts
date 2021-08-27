import { CommandFactoryBase, ICommandService } from '../../contract';

export class DefaultCommandFactory extends CommandFactoryBase {
    public constructor(private m_BuildCmdFunc: (args: any[]) => ICommandService) {
        super();
    }

    public build(...cmdArgs: any[]) {
        return this.m_BuildCmdFunc(cmdArgs);
    }
}
import { CommandFactoryBase, ICommand } from '../..';

export class CommandFactory extends CommandFactoryBase {
    public constructor(
        private m_BuildFuncs: { [key: number]: (args: string[][]) => ICommand }
    ) {
        super();
    }

    public build(type: number, ...cmdArgs: string[][]) {
        if (this.m_BuildFuncs[type])
            return this.m_BuildFuncs[type](cmdArgs);

        throw new Error(`无效ICommand: ${type}`);
    }
}
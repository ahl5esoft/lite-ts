export type ExecOption = (cmd: CmdBase) => void;

export abstract class CmdBase {
    public dir = '';
    public ignoreReturn = false;
    public ms = 0;

    protected reset() {
        this.dir = '';
        this.ignoreReturn = false;
        this.ms = 0;
    }

    public abstract exec(name: string, ...args: any[]): Promise<string>;
}

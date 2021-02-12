export type ExecOption = (cmd: CmdBase) => void;

export abstract class CmdBase {
    public abstract exec(...opts: ExecOption[]): Promise<string>;
}

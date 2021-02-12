export abstract class CmdBase {
    public abstract exec(opt: any): Promise<string>;
    public abstract execWithoutReturn(opt: any): Promise<void>;
}

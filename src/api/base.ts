export abstract class APIBase {
    public abstract auth(): Promise<boolean>;
    public abstract call(): Promise<any>;
    public abstract valid(ctx: any): Promise<boolean>;
}
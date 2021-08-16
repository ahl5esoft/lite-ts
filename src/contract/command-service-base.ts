export abstract class CommandServiceBase {
    protected dirPath: string;
    protected expires: number;
    protected extra: any;

    public constructor(protected args: any[]) { }

    public setDir(v: string): this {
        this.dirPath = v;
        return this;
    }

    public setExpires(v: number): this {
        this.expires = v;
        return this;
    }

    public setExtra(v: any): this {
        this.extra = v;
        return this;
    }

    public abstract exec(): Promise<string>;
}
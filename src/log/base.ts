export abstract class LogBase {
    public static ErrorMessageKey = "err-message";
    public static ErrorStackKey = "err-stack";

    protected content: { [key: string]: string; } = {};

    public addAttr(key: string, value: string): this {
        this.content[key] = value;
        return this;
    }

    public addDesc(value: string): this {
        return this.addAttr('desc', value);
    }

    public addError(ex: Error) {
        this.addAttr(LogBase.ErrorMessageKey, ex.message);
        if (ex.stack)
            this.addAttr(LogBase.ErrorStackKey, ex.stack);
    }

    public abstract debug(): Promise<void>;
    public abstract error(): Promise<void>;
    public abstract info(): Promise<void>;
    public abstract warning(): Promise<void>;
}
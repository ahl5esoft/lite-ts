export abstract class NowTimeBase {
    public abstract unix(): Promise<number>;
    public abstract unixNano(): Promise<number>;
}
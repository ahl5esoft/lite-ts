export abstract class SmsBase {
    public abstract send<T>(data: T): Promise<void>;
}
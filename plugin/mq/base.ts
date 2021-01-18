export abstract class MQBase {
    public abstract publish(channel: string, message: any): Promise<void>;
    public abstract subscribe(channel: string, action: (message: string) => void): Promise<void>;
}
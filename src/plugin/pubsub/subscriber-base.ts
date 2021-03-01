export type CallbackType = (message: string) => Promise<void>;

export interface ISubscriber {
    subscribe(channel: string, callback: CallbackType): Promise<void>;
}

export abstract class SubscriberBase implements ISubscriber {
    public abstract subscribe(channel: string, callback: CallbackType): Promise<void>;
    public abstract unsubscribe(...channels: string[]): Promise<void>;
}
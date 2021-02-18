export type CallbackType = (message: string) => Promise<void>;

export interface ISubscriber {
    subscribe(channel: string, callback: CallbackType): Promise<void>;
}
export interface IPublisher {
    publish(channel: string, message: any): Promise<number>;
}
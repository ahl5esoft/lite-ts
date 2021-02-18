export interface IPublisher {
    publish(channel: string, message: any): Promise<void>;
}

export abstract class PublisherBase implements IPublisher {
    public abstract publish(channel: string, message: any): Promise<void>;
}
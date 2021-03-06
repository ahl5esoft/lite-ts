import 'reflect-metadata';
import Container from 'typedi';

import { APIFactory, IORedisAdapter, OSDirectory, PublisherBase, PubSubAPIPort, SubscriberBase } from '../src';

(async () => {
    const project = 'lite-ts';
    const replyID = 'reply';
    const redis = new IORedisAdapter({
        host: '127.0.0.1',
        port: 6379,
    });
    Container.set(PublisherBase, redis);
    Container.set(SubscriberBase, redis);
    setTimeout(async () => {
        await redis.publish(project, {
            api: 'version',
            body: '{}',
            endpoint: 'test',
            replyID: replyID
        });
        const receiveChannel = `${project}-${replyID}`;
        await redis.subscribe(receiveChannel, async (message: string): Promise<void> => {
            console.log(message);
            await redis.unsubscribe(receiveChannel);
        });
    }, 1000);

    const apiFactory = new APIFactory();
    await apiFactory.init(
        new OSDirectory(__dirname, 'api')
    );
    new PubSubAPIPort(project, apiFactory).listen();
})();
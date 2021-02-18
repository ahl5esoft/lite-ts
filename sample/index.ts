import 'reflect-metadata';

import Container from 'typedi';

import { APIFactory } from '../src/api';
import { OSFactory } from '../src/os';
import { PublisherBase, PubSubAPIPort, SubscriberBase } from '../src/plugin/pubsub';
import { IORedisAdapter } from '../src/plugin/redis';

(async () => {
    const redis = new IORedisAdapter({
        host: '127.0.0.1',
        port: 6379,
    });
    Container.set(PublisherBase, redis);
    Container.set(SubscriberBase, redis);

    const apiFactory = new APIFactory(
        __dirname,
        new OSFactory()
    );
    Container.set(APIFactory, apiFactory);

    const project = 'lite-ts';
    const replyID = 'reply';
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

    new PubSubAPIPort(project).listen();
})();
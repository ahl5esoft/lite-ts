import 'reflect-metadata';

import { APIBase, APIFactory, APIResponse, IORedisAdapter, Mock, PublisherBase, PubSubAPIPort } from '../../../../src';
import { APIMessage } from '../../../../src/plugin/pubsub/api-message';

const redis = new IORedisAdapter({
    host: '127.0.0.1',
    port: 6379
});

describe('src/plugin/pubsub/api-port.ts', () => {
    after(() => {
        redis.close();
    });

    describe('.listen()', () => {
        it('ok', async () => {
            const mockAPIFactory = new Mock<APIFactory>();
            const project = 'test';
            const self = new PubSubAPIPort(mockAPIFactory.actual, project, '0.0.0');
            Reflect.set(self, 'm_Sub', redis);

            self.listen();

            const msg: APIMessage = {
                api: 'api',
                body: {},
                endpoint: 'end',
                replyID: 'x'
            };
            await redis.publish(project, msg);

            const mockAPI = new Mock<APIBase>();
            mockAPIFactory.expectReturn(
                r => r.build(msg.endpoint, msg.api),
                mockAPI.actual
            );

            const apiResponse: APIResponse = {
                data: 'ok',
                err: 0
            };
            mockAPI.expectReturn(
                r => r.getResposne(),
                apiResponse
            );

            const mockPub = new Mock<PublisherBase>();
            Reflect.set(self, 'm_Pub', mockPub.actual);

            mockPub.expected.publish(`${project}-${msg.replyID}`, apiResponse);
        });

        // it('verify', async () => {
        //     const channel = 'test';
        //     const mockAPIFactroy: any = {
        //         build: (...args) => {
        //             mockAPIFactroy.buildArgs = args;
        //             return new TestAPI(() => {
        //                 return 'ok';
        //             });
        //         },
        //         buildArgs: null
        //     };
        //     const self = new PubSubAPIPort(channel, mockAPIFactroy);

        //     const mockSub: any = {
        //         subscribe: (channel: string, callback: (msg: string) => void) => {
        //             mockSub.subscribeArgs = [channel];
        //             const message: APIMessage = {
        //                 api: 'a',
        //                 body: {},
        //                 endpoint: 'b',
        //                 replyID: 'reply-id'
        //             };
        //             callback(
        //                 JSON.stringify(message)
        //             );
        //         },
        //         subscribeArgs: null
        //     };
        //     Reflect.set(self, 'm_Sub', mockSub);

        //     const mockPub: any = {
        //         publish: (...args) => {
        //             mockPub.publishArgs = args;
        //         },
        //         publishArgs: null
        //     };
        //     Reflect.set(self, 'm_Pub', mockPub);

        //     await self.listen();

        //     await sleep(100);

        //     deepStrictEqual(mockSub.subscribeArgs, [channel]);
        //     deepStrictEqual(mockAPIFactroy.buildArgs, ['b', 'a']);
        //     deepStrictEqual(mockPub.publishArgs, [`${channel}-reply-id`, {
        //         data: '',
        //         err: ErrorCode.Verify
        //     }]);
        // });

        // it('api panic error', async () => {
        //     const channel = 'test';
        //     const mockAPIFactroy: any = {
        //         build: (...args) => {
        //             mockAPIFactroy.buildArgs = args;
        //             return new TestAPI(() => {
        //                 throw new Error('err');
        //             });
        //         },
        //         buildArgs: null
        //     };
        //     const self = new PubSubAPIPort(channel, mockAPIFactroy);

        //     const mockSub: any = {
        //         subscribe: (channel: string, callback: (msg: string) => void) => {
        //             mockSub.subscribeArgs = [channel];
        //             const message: APIMessage = {
        //                 api: 'a',
        //                 body: {
        //                     name: 'api'
        //                 },
        //                 endpoint: 'b',
        //                 replyID: 'reply-id'
        //             };
        //             callback(
        //                 JSON.stringify(message)
        //             );
        //         },
        //         subscribeArgs: null
        //     };
        //     Reflect.set(self, 'm_Sub', mockSub);

        //     const mockPub: any = {
        //         publish: (...args) => {
        //             mockPub.publishArgs = args;
        //         },
        //         publishArgs: null
        //     };
        //     Reflect.set(self, 'm_Pub', mockPub);

        //     await self.listen();

        //     await sleep(100);

        //     deepStrictEqual(mockSub.subscribeArgs, [channel]);
        //     deepStrictEqual(mockAPIFactroy.buildArgs, ['b', 'a']);
        //     deepStrictEqual(mockPub.publishArgs, [`${channel}-reply-id`, {
        //         data: '',
        //         err: ErrorCode.Panic
        //     }]);
        // });

        // it('api custom error', async () => {
        //     const channel = 'test';
        //     const mockAPIFactroy: any = {
        //         build: (...args) => {
        //             mockAPIFactroy.buildArgs = args;
        //             return new TestAPI(() => {
        //                 throw new CustomError(ErrorCode.Tip, 'tt');
        //             });
        //         },
        //         buildArgs: null
        //     };
        //     const self = new PubSubAPIPort(channel, mockAPIFactroy);

        //     const mockSub: any = {
        //         subscribe: (channel: string, callback: (msg: string) => void) => {
        //             mockSub.subscribeArgs = [channel];
        //             const message: APIMessage = {
        //                 api: 'a',
        //                 body: {
        //                     name: 'api'
        //                 },
        //                 endpoint: 'b',
        //                 replyID: 'reply-id'
        //             };
        //             callback(
        //                 JSON.stringify(message)
        //             );
        //         },
        //         subscribeArgs: null
        //     };
        //     Reflect.set(self, 'm_Sub', mockSub);

        //     const mockPub: any = {
        //         publish: (...args) => {
        //             mockPub.publishArgs = args;
        //         },
        //         publishArgs: null
        //     };
        //     Reflect.set(self, 'm_Pub', mockPub);

        //     await self.listen();

        //     await sleep(100);

        //     deepStrictEqual(mockSub.subscribeArgs, [channel]);
        //     deepStrictEqual(mockAPIFactroy.buildArgs, ['b', 'a']);
        //     deepStrictEqual(mockPub.publishArgs, [`${channel}-reply-id`, {
        //         data: 'tt',
        //         err: ErrorCode.Tip
        //     }]);
        // });
    });
});
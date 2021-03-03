import 'reflect-metadata';

import { deepStrictEqual } from 'assert';

import { APIBase, CustomError, ErrorCode, PubSubAPIPort, sleep } from '../../../../src';
import { APIMessage } from '../../../../src/plugin/pubsub/api-message';
import { Length } from 'class-validator';

class TestAPI extends APIBase {
    @Length(1, 6)
    public name: string;

    public constructor(private m_CallFunc: () => any) {
        super();
    }

    public async call() {
        return this.m_CallFunc();
    }
}

describe('src/plugin/pubsub/api-port.ts', () => {
    describe('.listen()', () => {
        it('ok', async () => {
            const channel = 'test';
            const mockAPIFactroy: any = {
                build: (...args) => {
                    mockAPIFactroy.buildArgs = args;
                    return new TestAPI(() => {
                        return 'ok';
                    });
                },
                buildArgs: null
            };
            const self = new PubSubAPIPort(channel, mockAPIFactroy);

            const mockSub: any = {
                subscribe: (channel: string, callback: (msg: string) => void) => {
                    mockSub.subscribeArgs = [channel];
                    const message: APIMessage = {
                        api: 'a',
                        body: {
                            name: 'hello'
                        },
                        endpoint: 'b',
                        replyID: 'reply-id'
                    };
                    callback(
                        JSON.stringify(message)
                    );
                },
                subscribeArgs: null
            };
            Reflect.set(self, 'm_Sub', mockSub);

            const mockPub: any = {
                publish: (...args) => {
                    mockPub.publishArgs = args;
                },
                publishArgs: null
            };
            Reflect.set(self, 'm_Pub', mockPub);

            await self.listen();

            await sleep(100);

            deepStrictEqual(mockSub.subscribeArgs, [channel]);
            deepStrictEqual(mockAPIFactroy.buildArgs, ['b', 'a']);
            deepStrictEqual(mockPub.publishArgs, [`${channel}-reply-id`, {
                data: 'ok',
                err: 0
            }]);
        });

        it('verify', async () => {
            const channel = 'test';
            const mockAPIFactroy: any = {
                build: (...args) => {
                    mockAPIFactroy.buildArgs = args;
                    return new TestAPI(() => {
                        return 'ok';
                    });
                },
                buildArgs: null
            };
            const self = new PubSubAPIPort(channel, mockAPIFactroy);

            const mockSub: any = {
                subscribe: (channel: string, callback: (msg: string) => void) => {
                    mockSub.subscribeArgs = [channel];
                    const message: APIMessage = {
                        api: 'a',
                        body: {},
                        endpoint: 'b',
                        replyID: 'reply-id'
                    };
                    callback(
                        JSON.stringify(message)
                    );
                },
                subscribeArgs: null
            };
            Reflect.set(self, 'm_Sub', mockSub);

            const mockPub: any = {
                publish: (...args) => {
                    mockPub.publishArgs = args;
                },
                publishArgs: null
            };
            Reflect.set(self, 'm_Pub', mockPub);

            await self.listen();

            await sleep(100);

            deepStrictEqual(mockSub.subscribeArgs, [channel]);
            deepStrictEqual(mockAPIFactroy.buildArgs, ['b', 'a']);
            deepStrictEqual(mockPub.publishArgs, [`${channel}-reply-id`, {
                data: '',
                err: ErrorCode.Verify
            }]);
        });

        it('api panic error', async () => {
            const channel = 'test';
            const mockAPIFactroy: any = {
                build: (...args) => {
                    mockAPIFactroy.buildArgs = args;
                    return new TestAPI(() => {
                        throw new Error('err');
                    });
                },
                buildArgs: null
            };
            const self = new PubSubAPIPort(channel, mockAPIFactroy);

            const mockSub: any = {
                subscribe: (channel: string, callback: (msg: string) => void) => {
                    mockSub.subscribeArgs = [channel];
                    const message: APIMessage = {
                        api: 'a',
                        body: {
                            name: 'api'
                        },
                        endpoint: 'b',
                        replyID: 'reply-id'
                    };
                    callback(
                        JSON.stringify(message)
                    );
                },
                subscribeArgs: null
            };
            Reflect.set(self, 'm_Sub', mockSub);

            const mockPub: any = {
                publish: (...args) => {
                    mockPub.publishArgs = args;
                },
                publishArgs: null
            };
            Reflect.set(self, 'm_Pub', mockPub);

            await self.listen();

            await sleep(100);

            deepStrictEqual(mockSub.subscribeArgs, [channel]);
            deepStrictEqual(mockAPIFactroy.buildArgs, ['b', 'a']);
            deepStrictEqual(mockPub.publishArgs, [`${channel}-reply-id`, {
                data: '',
                err: ErrorCode.Panic
            }]);
        });

        it('api custom error', async () => {
            const channel = 'test';
            const mockAPIFactroy: any = {
                build: (...args) => {
                    mockAPIFactroy.buildArgs = args;
                    return new TestAPI(() => {
                        throw new CustomError(ErrorCode.Tip, 'tt');
                    });
                },
                buildArgs: null
            };
            const self = new PubSubAPIPort(channel, mockAPIFactroy);

            const mockSub: any = {
                subscribe: (channel: string, callback: (msg: string) => void) => {
                    mockSub.subscribeArgs = [channel];
                    const message: APIMessage = {
                        api: 'a',
                        body: {
                            name: 'api'
                        },
                        endpoint: 'b',
                        replyID: 'reply-id'
                    };
                    callback(
                        JSON.stringify(message)
                    );
                },
                subscribeArgs: null
            };
            Reflect.set(self, 'm_Sub', mockSub);

            const mockPub: any = {
                publish: (...args) => {
                    mockPub.publishArgs = args;
                },
                publishArgs: null
            };
            Reflect.set(self, 'm_Pub', mockPub);

            await self.listen();

            await sleep(100);

            deepStrictEqual(mockSub.subscribeArgs, [channel]);
            deepStrictEqual(mockAPIFactroy.buildArgs, ['b', 'a']);
            deepStrictEqual(mockPub.publishArgs, [`${channel}-reply-id`, {
                data: 'tt',
                err: ErrorCode.Tip
            }]);
        });
    });
});
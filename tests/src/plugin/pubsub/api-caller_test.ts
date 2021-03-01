import 'reflect-metadata';

import { deepStrictEqual, ok, strictEqual } from 'assert';

import { CustomError, ErrorCode, PubSubAPICaller } from '../../../../src';

describe('src/plugin/pubsub/api-caller.ts', () => {
    describe('.call<T>(route: string, body: any, ms?: number): Promise<T>', () => {
        it('ok', async () => {
            const self = new PubSubAPICaller();

            const replyID = 'reply-id';
            const mockIDGenerator: any = {
                generate: () => {
                    return replyID;
                }
            };
            Reflect.set(self, 'm_IDGenerator', mockIDGenerator);

            const mockSub: any = {
                subscribe: (channel: string, callback: ((msg: string) => void)) => {
                    mockSub.subscribeArgs = [channel];
                    callback(
                        JSON.stringify({
                            err: 0,
                            data: 'ok'
                        })
                    );
                },
                subscribeArgs: null,
                unsubscribe: (...args) => {
                    mockSub.unsubscribeArgs = args;
                },
                unsubscribeArgs: null
            };
            Reflect.set(self, 'm_Sub', mockSub);

            const mockPub: any = {
                publish: (...args) => {
                    mockPub.publishArgs = args;
                },
                publishArgs: null
            };
            Reflect.set(self, 'm_Pub', mockPub);

            const route = 'a/b/c';
            const body = {};
            const res = await self.call(route, body);
            strictEqual(res, 'ok');
            deepStrictEqual(mockSub.subscribeArgs, [`a-${replyID}`]);
            deepStrictEqual(mockSub.unsubscribeArgs, [`a-${replyID}`]);
            deepStrictEqual(mockPub.publishArgs, ['a', {
                api: 'c',
                body: '{}',
                endpoint: 'b',
                replyID: replyID
            }]);
        });

        it('err', async () => {
            const self = new PubSubAPICaller();

            const replyID = 'reply-id';
            const mockIDGenerator: any = {
                generate: () => {
                    return replyID;
                }
            };
            Reflect.set(self, 'm_IDGenerator', mockIDGenerator);

            const mockSub: any = {
                subscribe: (channel: string, callback: ((msg: string) => void)) => {
                    mockSub.subscribeArgs = [channel];
                    callback(
                        JSON.stringify({
                            err: 1
                        })
                    );
                },
                subscribeArgs: null,
                unsubscribe: (...args) => {
                    mockSub.unsubscribeArgs = args;
                },
                unsubscribeArgs: null
            };
            Reflect.set(self, 'm_Sub', mockSub);

            const mockPub: any = {
                publish: (...args) => {
                    mockPub.publishArgs = args;
                },
                publishArgs: null
            };
            Reflect.set(self, 'm_Pub', mockPub);

            const route = 'a/b/c';
            const body = {};
            let err: CustomError;
            try {
                await self.call(route, body);
            } catch (ex) {
                err = ex;
            }

            ok(err);
            strictEqual(err.code, 1);
            deepStrictEqual(mockSub.subscribeArgs, [`a-${replyID}`]);
            deepStrictEqual(mockSub.unsubscribeArgs, [`a-${replyID}`]);
            deepStrictEqual(mockPub.publishArgs, ['a', {
                api: 'c',
                body: '{}',
                endpoint: 'b',
                replyID: replyID
            }]);
        });

        it('timeout', async () => {
            const self = new PubSubAPICaller();

            const replyID = 'reply-id';
            const mockIDGenerator: any = {
                generate: () => {
                    return replyID;
                }
            };
            Reflect.set(self, 'm_IDGenerator', mockIDGenerator);

            const mockSub: any = {
                subscribe: (channel: string) => {
                    mockSub.subscribeArgs = [channel];
                },
                subscribeArgs: null,
                unsubscribe: (...args) => {
                    mockSub.unsubscribeArgs = args;
                },
                unsubscribeArgs: null
            };
            Reflect.set(self, 'm_Sub', mockSub);

            const mockPub: any = {
                publish: (...args) => {
                    mockPub.publishArgs = args;
                },
                publishArgs: null
            };
            Reflect.set(self, 'm_Pub', mockPub);

            const route = 'a/b/c';
            const body = {};

            let err: CustomError;
            try {
                await self.call(route, body, 300);
            } catch (ex) {
                err = ex;
            }

            ok(err);
            strictEqual(err.code, ErrorCode.Timeout);
            deepStrictEqual(mockSub.subscribeArgs, [`a-${replyID}`]);
            strictEqual(mockSub.unsubscribeArgs, null);
            deepStrictEqual(mockPub.publishArgs, ['a', {
                api: 'c',
                body: '{}',
                endpoint: 'b',
                replyID: replyID
            }]);
        });
    });
});
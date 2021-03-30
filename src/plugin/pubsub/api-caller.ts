import Container from 'typedi';

import { APIMessage } from './api-message';
import { PublisherBase } from './publisher-base';
import { SubscriberBase } from './subscriber-base';
import { APICallerBase, APIResponse } from '../../api';
import { CustomError, ErrorCode } from '../../error';
import { StringGeneratorBase } from '../../object';

export class PubSubAPICaller extends APICallerBase {
    public static expires = 5000;

    private m_IDGenerator: StringGeneratorBase;
    protected get idGenerator() {
        if (!this.m_IDGenerator)
            this.m_IDGenerator = Container.get<StringGeneratorBase>(StringGeneratorBase as any);

        return this.m_IDGenerator;
    }

    private m_Pub: PublisherBase;
    protected get pub() {
        if (!this.m_Pub)
            this.m_Pub = Container.get<PublisherBase>(PublisherBase as any);

        return this.m_Pub;
    }

    private m_Sub: SubscriberBase;
    protected get sub() {
        if (!this.m_Sub)
            this.m_Sub = Container.get<SubscriberBase>(SubscriberBase as any);

        return this.m_Sub;
    }

    public async call<T>(route: string, body: any, ms?: number): Promise<T> {
        return Promise.race([
            new Promise<T>((_, f) => {
                setTimeout(() => {
                    f(
                        new CustomError(ErrorCode.Timeout)
                    );
                }, ms || PubSubAPICaller.expires);
            }),
            new Promise<T>(async (s, f) => {
                const routeParams = route.split('/');
                const req = {
                    api: routeParams[2],
                    body: typeof body == 'string' ? body : JSON.stringify(body),
                    endpoint: routeParams[1],
                    replyID: await this.idGenerator.generate()
                };
                const channel = `${routeParams[0]}-${req.replyID}`;
                await this.sub.subscribe(channel, async msg => {
                    await this.sub.unsubscribe(channel);

                    const resp = JSON.parse(msg) as APIResponse;
                    if (resp.err) {
                        return f(
                            new CustomError(resp.err, resp.data)
                        );
                    }

                    s(resp.data as T);
                });
                await this.pub.publish(routeParams[0], req);
            })
        ]);
    }

    public async voidCall(route: string) {
        const routeParams = route.split('/');
        const message: APIMessage = {
            api: routeParams[2],
            body: this.body,
            endpoint: routeParams[1],
            replyID: ''
        };
        await this.pub.publish(routeParams[0], message).finally(() => {
            this.body = {};
            this.headers = {};
        });
    }
}
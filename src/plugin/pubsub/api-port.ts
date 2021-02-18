import { validate } from 'class-validator';
import moment from 'moment';
import Container from 'typedi';

import { PublisherBase } from './publisher-base';
import { SubscriberBase } from './subscriber-base';
import { APIFactory, APIResponse, IAPIPort } from '../../api';
import { CustomError, ErrorCode } from '../../error';

class APIMessage {
    public api: string;

    public body: string;

    public endpoint: string;

    public replyID: string;
}

export class PubSubAPIPort implements IAPIPort {
    private m_APIFactory: APIFactory;
    protected get apiFactory(): APIFactory {
        if (!this.m_APIFactory)
            this.m_APIFactory = Container.get(APIFactory);

        return this.m_APIFactory;
    }

    private m_Pub: PublisherBase;
    protected get pub(): PublisherBase {
        if (!this.m_Pub)
            this.m_Pub = Container.get(PublisherBase);

        return this.m_Pub;
    }

    private m_Sub: SubscriberBase;
    protected get sub(): SubscriberBase {
        if (!this.m_Sub)
            this.m_Sub = Container.get(SubscriberBase);

        return this.m_Sub;
    }

    public constructor(private m_Channel: string) { }

    public listen(): void {
        this.sub.subscribe(this.m_Channel, async (message: string): Promise<void> => {
            return this.handle(message);
        });
        console.log(`${this.m_Channel}启动于${moment().format('YYYY-MM-DD HH:mm:ss')}`);
    }

    private async handle(message: string): Promise<void> {
        const req = JSON.parse(message) as APIMessage;
        const resp = new APIResponse();
        try {
            const api = await this.apiFactory.build(req.endpoint, req.api);
            const body = JSON.parse(req.body);
            Object.keys(body).forEach(r => {
                api[r] = body[r];
            });
            const errors = await validate(api);
            if (errors.length) {
                const message = errors.map((r): string => {
                    return r.toString();
                }).join('\n-');
                throw new CustomError(ErrorCode.Verify, message);
            }

            resp.data = await api.call();
        } catch (ex) {
            if (ex instanceof CustomError) {
                resp.err = ex.code;
                resp.data = ex.code == ErrorCode.Tip ? ex.message : '';
            } else {
                resp.err = ErrorCode.Panic;
                console.log(ex);
            }
        } finally {
            await this.pub.publish(`${this.m_Channel}-${req.replyID}`, resp);
        }
    }
}
import { validate } from 'class-validator';
import moment from 'moment';
import Container from 'typedi';

import { APIMessage } from './api-message';
import { PublisherBase } from './publisher-base';
import { SubscriberBase } from './subscriber-base';
import { APIFactory, APIResponse, IAPIPort } from '../../api';
import { CustomError, ErrorCode } from '../../error';

export class PubSubAPIPort implements IAPIPort {
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

    public constructor(private m_Channel: string, private m_APIFactory: APIFactory) { }

    public async listen() {
        await this.sub.subscribe(this.m_Channel, async (message: string) => {
            const req = JSON.parse(message) as APIMessage;
            const resp: APIResponse = {
                err: 0,
                data: null
            };
            try {
                const api = await this.m_APIFactory.build(req.endpoint, req.api);
                Object.keys(req.body || {}).forEach(r => {
                    api[r] = req.body[r];
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
                    resp.data = ex.code == ErrorCode.Tip ? ex.message : '';
                    resp.err = ex.code;
                } else {
                    resp.data = '';
                    resp.err = ErrorCode.Panic;
                    console.log(ex);
                }
            } finally {
                if (req.replyID)
                    await this.pub.publish(`${this.m_Channel}-${req.replyID}`, resp);
            }
        });
        console.log(`${this.m_Channel}启动于${moment().format('YYYY-MM-DD HH:mm:ss')}`);
    }
}
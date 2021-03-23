import moment from 'moment';
import Container from 'typedi';

import { APIMessage } from './api-message';
import { PublisherBase } from './publisher-base';
import { SubscriberBase } from './subscriber-base';
import { APIFactory, IAPIPort } from '../../api';
import { FileBase } from '../../io';

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

    public constructor(private m_APIFactory: APIFactory, private m_PackageFile: FileBase) { }

    public async listen() {
        const pkg = await this.m_PackageFile.readJSON<{
            name: string;
            version: string;
        }>();
        await this.sub.subscribe(pkg.name, async (message: string) => {
            const req = JSON.parse(message) as APIMessage;
            const api = this.m_APIFactory.build(req.endpoint, req.api);
            if (typeof req.body == 'string')
                req.body = JSON.parse(req.body);
            Object.keys(req.body || {}).forEach(r => {
                api[r] = req.body[r];
            });
            const res = await api.getResposne();
            if (req.replyID)
                await this.pub.publish(`${pkg.name}-${req.replyID}`, res);
        });
        console.log(`${pkg.name}(v${pkg.version})[${moment().format('YYYY-MM-DD HH:mm:ss')}]`);
    }
}
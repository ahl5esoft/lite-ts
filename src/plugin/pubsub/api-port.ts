import { validate } from 'class-validator';
import moment from 'moment';
import Container from 'typedi';

import { APIMessage } from './api-message';
import { PublisherBase } from './publisher-base';
import { SubscriberBase } from './subscriber-base';
import { APIFactory, APIResponse, IAPIPort } from '../../api';
import { CustomError, ErrorCode } from '../../error';
import { DirectoryBase, IOFactoryBase } from '../../io';

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

    public constructor(private m_APIFactory: APIFactory, private m_IOFactory: IOFactoryBase, private m_RootDir: DirectoryBase) { }

    public async listen() {
        const pkg = await this.m_IOFactory.buildFile(this.m_RootDir.path, 'package.json').readJSON<{
            name: string;
            version: string;
        }>();
        await this.sub.subscribe(pkg.name, async (message: string) => {
            const req = JSON.parse(message) as APIMessage;
            const resp: APIResponse = {
                err: 0,
                data: null
            };
            try {
                const api = await this.m_APIFactory.build(req.endpoint, req.api);
                if (typeof req.body == 'string')
                    req.body = JSON.parse(req.body);
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
                    await this.pub.publish(`${pkg.name}-${req.replyID}`, resp);
            }
        });
        console.log(`${pkg.name}(v${pkg.version})[${moment().format('YYYY-MM-DD HH:mm:ss')}]`);
    }
}
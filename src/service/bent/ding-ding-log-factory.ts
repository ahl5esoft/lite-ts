import bent from 'bent';

import { LogFactoryBase } from '../..';
import { DingDingLog } from './ding-ding-log';

interface IResponse {
    errcode: number;
    errmsg: string;
}

export class DingDingLogFactory extends LogFactoryBase {
    private m_PostFunc: bent.RequestFunction<bent.Json>;

    public constructor(
        private m_Keyword: string,
        url: string
    ) {
        super();

        this.m_PostFunc = bent(url, 'json', 'POST', 200);
    }

    public build() {
        return new DingDingLog(this);
    }

    public async send(labels: [string, any][]) {
        if (!labels.length)
            return;

        const text = labels.map(r => {
            if (r[1] instanceof Error)
                return `> ${r[1].message}\n> ${r[1].stack}`;

            return `- ${r[0]}: ${r[1]}`;
        }).join('\n');
        const res = await this.m_PostFunc('', {
            msgtype: 'markdown',
            markdown: {
                title: this.m_Keyword,
                text: text,
            },
        });
        const resp = res as IResponse;
        if (resp.errcode)
            throw new Error(resp.errmsg);
    }
}
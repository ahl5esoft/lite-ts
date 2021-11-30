import bent from 'bent';

import { IPush } from '../..';

interface IRequest {
    msgtype: string;
    markdown: {
        text: string;
        title: string;
    }
}

interface IResponse {
    errcode: number;
    errmsg: string;
}

export class BentDingDingMarkdownPush implements IPush {
    private m_PostFunc: bent.RequestFunction<bent.Json>;

    public constructor(
        private m_Keyword: string,
        url: string
    ) {
        this.m_PostFunc = bent(url, 'json', 'POST', 200);
    }

    public async push(text: string) {
        const req: IRequest = {
            msgtype: 'markdown',
            markdown: {
                text: text,
                title: this.m_Keyword
            }
        };
        const res = await this.m_PostFunc('', req);
        const resp = res as IResponse;
        if (resp.errcode)
            throw new Error(resp.errmsg);
    }
}
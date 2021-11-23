import bent from 'bent';

import { ILog } from '../..';

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

let postFunc: bent.RequestFunction<bent.Json>;
let defaultRequest: IRequest;

export class DingDingLog implements ILog {
    private m_Labels: [string, any][] = [];

    public addLabel(k: string, v: string) {
        this.m_Labels.push([k, v]);
        return this;
    }

    public debug() {
        this.send().catch(console.error);
    }

    public info() {
        this.send().catch(console.error);
    }

    public error(err: Error) {
        this.m_Labels.push(['', err]);
        this.send().catch(console.error);
    }

    public warning() {
        this.send().catch(console.error);
    }

    private async send() {
        if (!this.m_Labels.length)
            return;

        const req = JSON.parse(
            JSON.stringify(defaultRequest)
        );
        req.markdown.text = this.m_Labels.map(r => {
            if (r[1] instanceof Error)
                return `> ${r[1].message}\n> ${r[1].stack}`;

            return `- ${r[0]}: ${r[1]}`;
        }).join('\n');
        const res = await postFunc('', req);
        this.m_Labels = [];
        const resp = res as IResponse;
        if (resp.errcode)
            throw new Error(resp.errmsg);
    }

    public static init(keyword: string, url: string) {
        defaultRequest = {
            msgtype: 'markdown',
            markdown: {
                text: '',
                title: keyword
            }
        };
        postFunc = bent(url, 'json', 'POST', 200);
    }
}
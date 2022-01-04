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

/**
 * 钉钉Markdown推送(基于bent实现)
 */
export class BentDingDingMarkdownPush implements IPush {
    /**
     * post请求函数
     */
    private m_PostFunc: bent.RequestFunction<bent.Json>;

    /**
     * 构造函数
     * 
     * @param m_Keyword 关键字
     * @param url 推送地址
     */
    public constructor(
        private m_Keyword: string,
        url: string
    ) {
        this.m_PostFunc = bent(url, 'json', 'POST', 200);
    }

    /**
     * 推送,推送失败的情况下抛错
     * 
     * @param text 推送文本
     * 
     * @example
     * ```typescript
     *  await new BentDingDingMarkdownPush('关键字', 'webhook地址').push(markdown内容);
     * ```
     */
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
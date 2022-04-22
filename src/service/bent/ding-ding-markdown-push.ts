import bent from 'bent';

import { PushBase } from '../../contract';

interface IResponse {
    /**
     * 错误码
     */
    errcode: number;
    /**
     * 错误消息
     */
    errmsg: string;
}

/**
 * 钉钉Markdown推送(基于bent实现)
 */
export class BentDingDingMarkdownPush extends PushBase {
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
        super();

        this.m_PostFunc = bent(url, 'json', 'POST', 200);
    }

    /**
     * 推送,推送失败的情况下抛错
     * 
     * @param text 推送文本
     * 
     * @example
     * ```typescript
     *  await new service.BentDingDingMarkdownPush('关键字', 'webhook地址').push(markdown内容);
     * ```
     */
    public async push(text: string) {
        const resp = await this.m_PostFunc('', {
            msgtype: 'markdown',
            markdown: {
                text: text,
                title: this.m_Keyword
            }
        }) as IResponse;
        if (resp.errcode)
            throw new Error(resp.errmsg);
    }
}
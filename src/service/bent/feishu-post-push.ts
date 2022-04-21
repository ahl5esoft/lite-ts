import bent from 'bent';

import { IPush } from '../../contract';
import { request } from '../../model';

interface IResposne {
    /**
     * 错误码
     */
    code: number;
    /**
     * 错误消息
     */
    msg: string;
}

/**
 * 飞书富文本推送
 */
export class BentFeishuPostPush implements IPush {
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
     * 推送
     * 
     * @param content 内容
     * 
     * @example
     * ```typescript
     *  await new service.FeishuPostPush('关键字', 'webhook地址').push([[...], ...]);
     * ```
     */
    public async push(content: request.FeishuPostPush[][]) {
        const resp = await this.m_PostFunc('', {
            msg_type: 'post',
            content: {
                post: {
                    zh_cn: {
                        content,
                        title: this.m_Keyword,
                    },
                }
            },
        }) as IResposne;
        if (resp.code) {
            console.log(content);
            throw new Error(resp.msg);
        }
    }
}
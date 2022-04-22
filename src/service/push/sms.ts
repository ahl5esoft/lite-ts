import { PushBase, SmsBase } from '../../contract';

/**
 * 推送短信
 */
export class PushSms extends SmsBase {
    /**
     * 构造函数
     * 
     * @param m_Push 推送
     * @param m_ConvertFunc 转换函数
     */
    public constructor(
        private m_Push: PushBase,
        private m_ConvertFunc: (content: any) => any
    ) {
        super();
    }

    /**
     * 发送
     * 
     * @param content 内容
     */
    public async send(content: any) {
        await this.m_Push.push(
            this.m_ConvertFunc(content)
        );
    }
}
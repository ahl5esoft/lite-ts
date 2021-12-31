/**
 * 短信接口
 */
export abstract class SmsBase {
    /**
     * 发送
     * 
     * @param data 短信内容
     */
    public abstract send<T>(data: T): Promise<void>;
}
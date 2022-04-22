/**
 * 短信接口
 */
export abstract class SmsBase {
    /**
     * 发送
     * 
     * @param content 内容
     */
    public abstract send<T>(content: T): Promise<void>;
}
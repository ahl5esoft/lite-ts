/**
 * 推送接口
 */
export abstract class PushBase {
    /**
     * 推送
     * 
     * @param content 内容
     */
    public abstract push(content: any): Promise<void>;
}
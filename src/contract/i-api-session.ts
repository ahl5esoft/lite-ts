/**
 * api会话
 */
export interface IApiSession {
    /**
     * 初始化会话
     * 
     * @param req 请求对象
     */
    initSession(req: any): Promise<void>;
}
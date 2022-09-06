/**
 * 用户安全服务
 */
export interface IUserSecurityService {
    /**
     * 检查文本
     * 
     * @param text 文本
     */
    checkText(text: string): Promise<boolean>;
}
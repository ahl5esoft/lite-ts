/**
 * 请求头
 */
export enum Header {
    /**
     * 认证数据
     */
    authData = 'H-A-D',
    /**
     * 认证令牌
     */
    authToken = 'H-A-T',
    /**
     * 环境
     */
    env = 'H-E',
    /**
     * 超时
     */
    timeout = 'H-T',
}
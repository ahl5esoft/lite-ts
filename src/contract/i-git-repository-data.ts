/**
 * git仓储凭证数据
 */
export interface IGitRepositoryData {
    /**
     * 访问令牌
     */
    accessToken: string;

    /**
     * http地址
     */
    httpUrl: string;

    /**
     * 协议, http/https/ssh
     */
    protocol: string;

    /**
     * 用户名
     */
    username: string;
}
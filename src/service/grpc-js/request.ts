/**
 * 请求
 */
export interface IGrpcJsRequset {
    /**
     * api
     */
    api: string;
    /**
     * 应用
     */
    app: string;
    /**
     * 请求体
     */
    body: { [key: string]: any };
    /**
     * 头
     */
    header: { [key: string]: string };
}
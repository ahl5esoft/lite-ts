/**
 * api响应结构
 */
export interface IApiResponse {
    /**
     * 响应数据
     */
    data: any;

    /**
     * 错误码
     */
    err: number;
}
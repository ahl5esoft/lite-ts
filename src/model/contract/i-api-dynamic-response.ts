import { IApiResponse } from './i-api-response';

/**
 * api动态响应
 */
export interface IApiDyanmicResponse<T> extends IApiResponse {
    /**
     * 响应数据
     */
    data: T;
}
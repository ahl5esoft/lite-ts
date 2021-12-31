/**
 * api接口
 */
export interface IApi {
    /**
     * 调用
     */
    call(): Promise<any>;
}
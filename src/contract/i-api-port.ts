/**
 * api端接口(后台\移动\内部等)
 */
export interface IApiPort {
    /**
     * 监听
     */
    listen(): Promise<void>;
}
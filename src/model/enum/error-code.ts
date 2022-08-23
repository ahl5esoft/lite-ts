/**
 * 错误码
 */
export enum ErrorCode {
    /**
     * api不存在
     */
    api = 501,
    /**
     * 认证失败
     */
    auth,
    /**
     * 请求数据不符合条件
     */
    verify,
    /**
     * 请求超时
     */
    timeout,
    /**
     * 数值类型不足
     */
    valueTypeNotEnough,
    /**
     * 重定向
     */
    redirect,
    /**
     * 服务端异常
     */
    panic = 599,
}

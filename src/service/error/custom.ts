/**
 * 自定义错误
 */
export class CustomError extends Error {
    /**
     * 构造函数
     * 
     * @param code 错误码
     * @param data 错误数据
     */
    public constructor(public code: number, public data?: any) {
        super('');
    }
}

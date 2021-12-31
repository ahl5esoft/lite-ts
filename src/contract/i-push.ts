/**
 * 推送接口
 */
export interface IPush {
    /**
     * 推送
     * 
     * @param data 数据
     */
    push(data: any): Promise<void>;
}
/**
 * 当前时间接口
 */
export abstract class NowTimeBase {
    /**
     * 时间戳, 单位: 秒
     */
    public abstract unix(): Promise<number>;

    /**
     * 时间戳, 单位: 纳秒
     */
    public abstract unixNano(): Promise<number>;
}
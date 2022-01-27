/**
 * 当前时间接口
 */
export abstract class NowTimeBase {
    /**
     * 是否同一天
     * 
     * @param unixTime 其他unix时间
     */
    public abstract isSameDayUnix(unixTime: number): Promise<boolean>;

    /**
     * 时间戳, 单位: 秒
     */
    public abstract unix(): Promise<number>;

    /**
     * 时间戳, 单位: 纳秒
     */
    public abstract unixNano(): Promise<number>;
}
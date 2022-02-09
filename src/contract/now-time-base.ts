import moment from 'moment';

/**
 * 当前时间接口
 */
export abstract class NowTimeBase {
    /**
     * 是否同一天
     * 
     * @param unixTime 其他unix时间
     */
    public async isSameDayUnix(unixTime: number) {
        const nowUnix = await this.unix();
        return moment.unix(nowUnix).isSame(
            moment.unix(unixTime),
            'day'
        );
    }

    /**
     * 时间戳, 单位: 秒
     */
    public abstract unix(): Promise<number>;

    /**
     * 时间戳, 单位: 纳秒
     */
    public abstract unixNano(): Promise<number>;
}
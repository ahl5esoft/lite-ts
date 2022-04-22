import { CacheBase, NowTimeBase } from '../../contract';

export class MemoryCache extends CacheBase {
    /**
     * 缓存
     */
    private m_Cache: { [key: string]: any };
    /**
     * 上次加载时间
     */
    private m_LastLoadedOn = 0;

    /**
     * 构造函数
     * 
     * @param m_NowTime 当前时间
     * @param m_LoadFunc 加载函数
     * @param m_ExpiredOn 过期时间, 默认: 10m
     */
    public constructor(
        private m_NowTime: NowTimeBase,
        private m_LoadFunc: () => Promise<{ [key: string]: any }>,
        private m_ExpiredOn = 10 * 60,
    ) {
        super();
    }

    /**
     * 清空缓存
     */
    public flush() {
        this.m_LastLoadedOn = 0;
    }

    /**
     * 获取
     * 
     * @param key 键
     */
    public async get<T>(key: string) {
        const now = await this.m_NowTime.unix();
        if (now - this.m_LastLoadedOn >= this.m_ExpiredOn) {
            this.m_Cache = await this.m_LoadFunc();
            this.m_LastLoadedOn = now;
        }

        return this.m_Cache[key] as T;
    }
}
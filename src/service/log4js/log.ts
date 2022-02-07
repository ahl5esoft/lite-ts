import log4js from 'log4js';

import { ILog } from '../..';

/**
 * log4js日志
 */
export class Log4jsLog implements ILog {
    /**
     * 标签
     */
    private m_Labels: { [key: string]: any } = {};

    /**
     * 增加标签
     * 
     * @param k 键
     * @param v 值
     */
    public addLabel(k: string, v: any) {
        this.m_Labels[k] = v;
        return this;
    }

    /**
     * 以调试格式输出日志
     */
    public debug() {
        this.log(r => r.debug);
    }

    /**
     * 以错误格式输出日志
     * 
     * @param err 错误
     */
    public error(err: Error) {
        this.addLabel('err', err);
        this.log(r => r.error);
    }

    /**
     * 以信息格式输出日志
     */
    public info() {
        this.log(r => r.info);
    }

    /**
     * 以告警格式输出日志
     */
    public warning() {
        this.log(r => r.warn);
    }

    /**
     * 输出日志
     * 
     * @param func 获取输出函数
     */
    private log(func: (logger: log4js.Logger) => (message: any) => void) {
        const logger = log4js.getLogger();
        const fn = func(logger).bind(logger);
        fn(
            JSON.stringify(this.m_Labels)
        );
    }

    /**
     * 初始化
     * 
     * @param cfg 配置
     */
    public static init(cfg: log4js.Configuration) {
        log4js.configure(cfg);
    }
}
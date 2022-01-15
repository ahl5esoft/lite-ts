import { ILog } from './i-log';

/**
 * 日志工厂
 * 
 * @deprecated LogBase
 */
export abstract class LogFactoryBase {
    /**
     * 创建日志对象
     * 
     * @param type 日志类型
     */
    public abstract build(type: number): ILog;
}
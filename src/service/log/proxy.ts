import { LogBase } from '../../contract';

/**
 * 日志代理
 */
export class LogProxy extends LogBase {
    /**
     * 构造函数
     * 
     * @param m_BuildFunc 创建函数
     */
    public constructor(
        private m_BuildFunc: () => LogBase
    ) {
        super();
    }

    /**
     * 增加标签
     * 
     * @param k 键
     * @param v 值
     */
    public addLabel(k: string, v: any) {
        return this.m_BuildFunc().addLabel(k, v);
    }

    /**
     * 以调试格式输出日志
     */
    public debug() { }

    /**
     * 以错误格式输出日志
     * 
     * @param err 错误
     */
    public error(err: Error) {
        this.m_BuildFunc().error(err);
    }

    /**
     * 以信息格式输出日志
     */
    public info() { }

    /**
     * 以告警格式输出日志
     */
    public warning() { }
}
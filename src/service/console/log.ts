import { LogBase } from '../../contract';

/**
 * 标准输出日志
 */
export class ConsoleLog extends LogBase {
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
    public addLabel(k: string, v: any): this {
        this.m_Labels[k] = v;
        return this;
    }

    /**
     * 调试
     */
    public debug() {
        console.debug(this.m_Labels);
    }

    /**
     * 错误
     * 
     * @param err 错误
     */
    public error(err: Error) {
        this.addLabel('err', err);
        console.error(this.m_Labels);
    }

    /**
     * 信息
     */
    public info() {
        console.info(this.m_Labels);
    }

    /**
     * 警告
     */
    public warning() {
        console.warn(this.m_Labels);
    }
}
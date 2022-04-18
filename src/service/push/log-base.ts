import { IPush, LogBase } from '../../contract';

/**
 * 推送日志基类
 */
export abstract class PushLogBase extends LogBase {
    /**
     * 标签
     */
    private m_Labels: [string, any][] = [];

    /**
     * 构造函数
     * 
     * @param m_Push 推送
     */
    public constructor(
        private m_Push: IPush
    ) {
        super();
    }

    /**
     * 添加标签
     * 
     * @param k 键
     * @param v 值
     */
    public addLabel(k: string, v: string) {
        this.m_Labels.push([k, v]);
        return this;
    }

    /**
     * 调试
     */
    public debug() {
        this.send().catch(console.error);
    }

    /**
     * 信息
     */
    public info() {
        this.send().catch(console.error);
    }

    /**
     * 错误
     * 
     * @param err 错误
     */
    public error(err: Error) {
        this.m_Labels.push(['', err]);
        this.send().catch(console.error);
    }

    /**
     * 警告
     */
    public warning() {
        this.send().catch(console.error);
    }

    /**
     * 发送
     */
    private async send() {
        if (!this.m_Labels.length)
            return;

        await this.m_Push.push(
            this.convertToPushMessage(this.m_Labels)
        );
        this.m_Labels = [];
    }

    /**
     * 转换成推送消息
     * 
     * @param labels 标签
     */
    protected abstract convertToPushMessage(labels: [string, any][]): any;
}
import { ILog, PushBase } from '../../contract';

export abstract class PushLogBase implements ILog {
    private m_Labels: [string, any][] = [];

    public constructor(
        private m_Push: PushBase
    ) { }

    public addLabel(k: string, v: string) {
        this.m_Labels.push([k, v]);
        return this;
    }

    public debug() {
        this.send().catch(console.error);
    }

    public info() {
        this.send().catch(console.error);
    }

    public error(err: Error) {
        this.m_Labels.push(['', err]);
        this.send().catch(console.error);
    }

    public warning() {
        this.send().catch(console.error);
    }

    private async send() {
        if (!this.m_Labels.length)
            return;

        await this.m_Push.push(
            this.convertToPushMessage(this.m_Labels)
        );
        this.m_Labels = [];
    }

    protected abstract convertToPushMessage(labels: [string, any][]): any;
}
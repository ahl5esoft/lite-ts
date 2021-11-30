import { ILog, IPush } from '../..';

export class PushLog implements ILog {
    private m_Labels: [string, any][] = [];

    public constructor(
        private m_Push: IPush
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

        const text = this.m_Labels.map(r => {
            if (r[1] instanceof Error)
                return `> ${r[1].message}\n> ${r[1].stack}`;

            return `- ${r[0]}: ${r[1]}`;
        }).join('\n');
        await this.m_Push.push(text);
    }
}
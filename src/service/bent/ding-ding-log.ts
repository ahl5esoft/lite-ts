import { DingDingLogFactory } from './ding-ding-log-factory';
import { ILog } from '../..';

export class DingDingLog implements ILog {
    private m_Labels: [string, any][] = [];

    public constructor(
        private m_Factory: DingDingLogFactory
    ) {
    }

    public addLabel(k: string, v: string) {
        this.m_Labels.push([k, v]);
        return this;
    }

    public debug() {
        this.m_Factory.send(this.m_Labels).catch(console.error);
    }

    public info() {
        this.m_Factory.send(this.m_Labels).catch(console.error);
    }

    public error(err: Error) {
        this.m_Labels.push(['', err]);
        this.m_Factory.send(this.m_Labels).catch(console.error);
    }

    public warning() {
        this.m_Factory.send(this.m_Labels).catch(console.error);
    }
}
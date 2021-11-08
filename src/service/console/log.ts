import { ILog } from '../..';

export class Log implements ILog {
    private m_Labels: { [key: string]: any } = {};

    public addLabel(k: string, v: any): this {
        this.m_Labels[k] = v;
        return this;
    }

    public debug() {
        console.debug(this.m_Labels);
    }

    public error(err: Error) {
        this.addLabel('err', err);
        console.error(this.m_Labels);
    }

    public info() {
        console.info(this.m_Labels);
    }

    public warning() {
        console.warn(this.m_Labels);
    }
}
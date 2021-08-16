import { LogBase } from '../../contract';

export class OSConsoleLog extends LogBase{
    public debug() {
        console.debug(this.labels);
        this.labels = {};
    }
    
    public error(err: Error) {
        this.addLabel('err', err);
        console.error(this.labels);
        this.labels = {};
    }

    public info() {
        console.info(this.labels);
        this.labels = {};
    }

    public warning() {
        console.warn(this.labels);
        this.labels = {};
    }
}
import { SmsBase } from '../..';

export class ConsoleSms extends SmsBase {
    public async send(v: any) {
        console.log(v);
    }
}
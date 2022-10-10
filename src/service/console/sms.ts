import { SmsBase } from '../../contract';

export class ConsoleSms extends SmsBase {
    public async send(v: any) {
        console.log(v);
    }
}
import { IPush, SmsBase } from '../..';

export class PushSms extends SmsBase {
    public constructor(
        private m_Push: IPush
    ) {
        super();
    }

    public async send(data: any) {
        await this.m_Push.push(
            JSON.stringify(data)
        );
    }
}
import { PushBase, SmsBase } from '../../contract';

export class PushSms extends SmsBase {
    public constructor(
        private m_Push: PushBase,
        private m_ConvertFunc: (content: any) => any
    ) {
        super();
    }

    public async send(content: any) {
        await this.m_Push.push(
            this.m_ConvertFunc(content)
        );
    }
}
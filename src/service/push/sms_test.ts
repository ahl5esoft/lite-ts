import { Mock } from 'lite-ts-mock';

import { PushSms as Self } from './sms';
import { PushBase } from '../../contract';

describe('src/service/push/sms.ts', () => {
    describe('.send(content: any)', () => {
        it('ok', async () => {
            const mockPush = new Mock<PushBase>();

            const data = [1, 2];
            mockPush.expected.push(data);

            const self = new Self(mockPush.actual, r => r);
            await self.send(data);
        });
    });
});
import { PushSms as Self } from './sms';
import { Mock } from '..';
import { IPush } from '../..';

describe('src/service/push/sms.ts', () => {
    describe('.send(data: any))', () => {
        it('ok', async () => {
            const mockPush = new Mock<IPush>();

            const data = [1, 2];
            mockPush.expected.push(
                JSON.stringify(data)
            );

            const self = new Self(mockPush.actual);
            await self.send(data);
        });
    });
});
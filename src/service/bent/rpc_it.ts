import { BentRpc as Self } from './rpc';

describe('src/service/bent/rpc.ts', () => {
    describe('.call<T>(route: string)', () => {
        it('ok', async () => {
            const self = new Self('http://127.0.0.1:30100');
            const res = await self.setBody({
                mobile: '13800000000'
            }).call('/lite-auth/oh/mobile-send-captcha');
            console.log(res);
        });
    });
});
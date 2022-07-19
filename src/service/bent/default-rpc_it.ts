import bent from 'bent';

import { BentDefaultRpc as Self } from './default-rpc';

describe('src/service/bent/default-rpc.ts', () => {
    describe('.callWithoutThrow<T>(route: string)', () => {
        it('ok', async () => {
            const postFunc = bent('http://127.0.0.1', 'json', 'POST', 200);
            const resp = await new Self(postFunc).setBody({
                id: 'user-id'
            }).callWithoutThrow<any>('/account/get-user');
            console.log(resp);
        });
    });
});
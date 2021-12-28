import { notStrictEqual } from 'assert';

import { SftpInvoker as Self } from './sftp-invoker';

describe('src/service/ssh2/sftp-invoker.ts', () => {
    describe('.getClient()[private]', () => {
        it('认证失败', async () => {
            const self = new Self({
                host: '127.0.0.1',
                password: '123456',
                username: 'root'
            });
            const fn = Reflect.get(self, 'getClient').bind(self);
            let err: Error;
            try {
                await fn();
            } catch (ex) {
                err = ex;
            }
            notStrictEqual(err, undefined);
        });
    });
});
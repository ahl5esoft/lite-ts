import { strictEqual } from 'assert';

import { SimpleGitRepository as Self } from './repository';

describe('src/service/simple-git/repository.ts', () => {
    describe('.fullHttpUrl[proctected]', () => {
        it('ok', async () => {
            const self = new Self(null, {
                accessToken: 'at',
                httpUrl: 'http://github.com/g/p.git',
                protocol: 'http',
                username: 'usr'
            });
            const res = Reflect.get(self, 'fullHttpUrl');
            strictEqual(res, 'http://usr:at@github.com/g/p.git');
        });
    });
});
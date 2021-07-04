import { strictEqual } from 'assert';

import { HandlerBase } from '../../../src/tool/version/handler-base';

class Handler extends HandlerBase {
    public version: string;

    public async handle(): Promise<void> {
        this.version = this.getVersion('1.2.3');
    }
}

describe('src/tool/version/handler-base.ts', () => {
    describe('getVersion(version: string): string', () => {
        it('最后一位', async () => {
            const self = new Handler('0.0.1');
            await self.handle();
            strictEqual(self.version, '1.2.4');
        });

        it('中间一位', async () => {
            const self = new Handler('0.1.1');
            await self.handle();
            strictEqual(self.version, '1.3.0');
        });

        it('第一位', async () => {
            const self = new Handler('1.1.1');
            await self.handle();
            strictEqual(self.version, '2.0.0');
        });
    });
});
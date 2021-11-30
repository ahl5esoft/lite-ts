import { BentDingDingMarkdownPush as Self } from './ding-ding-markdown-push';

describe('src/service/bent/ding-ding-markdown-push.ts', () => {
    describe('.push(text: string)', () => {
        it('ok', async () => {
            const self = new Self('关键字', 'webhook地址');
            await self.push('# 单元测试');
        });
    });
});
import { DingDingLog as Self } from './ding-ding-log';

describe('src/service/bent/ding-ding-log.ts', () => {
    describe('.error(err: Error)', () => {
        it('ok', () => {
            Self.init('关键字', 'webhook地址');
            const self = new Self();
            self.addLabel('标题', '异常').addLabel('k', 'v').error(
                new Error('堆栈')
            );
        });
    });
});
import { DingDingLogFactory } from '.';
import { DingDingLog as Self } from './ding-ding-log';

const factory = new DingDingLogFactory('关键字', 'webhook地址');

describe('src/service/bent/ding-ding-log.ts', () => {
    describe('.error(err: Error)', () => {
        it('ok', () => {
            const self = new Self(factory);
            self.addLabel('标题', '异常').addLabel('k', 'v').error(
                new Error('堆栈')
            );
        });
    });
});
import { DingDingLogFactory as Self } from './ding-ding-log-factory';

const keyword = '关键字';
const url = 'webhook地址';

describe('src/service/bent/ding-ding-log-factory.ts', () => {
    describe('.send()', () => {
        it('err', async () => {
            await new Self(keyword, url).send([
                ['标题', '测试异常'],
                ['键', '值'],
                ['', new Error('错误内容')]
            ]);
        });

        it('other', async () => {
            await new Self(keyword, url).send([
                ['标题', '正常'],
                ['键', '值']
            ]);
        });
    });
});
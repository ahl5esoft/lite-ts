import { ok, strictEqual } from 'assert';

import { CORBase, tool } from '../../../src';

let count = 0;

class NextHandler extends CORBase {
    public async handle(): Promise<void> {
        count = 100;
    }
}

describe('src/tool/version/check-handler.ts', () => {
    describe('.handle(): Promise<void>', () => {
        it('无效版本号', async () => {
            const self = new tool.version.CheckHandler('a');
            let err: Error;
            try {
                await self.handle();
            } catch (ex) {
                err = ex;
            }
            ok(err);
            strictEqual(err.message, '无效版本号: a');
        });

        it('ok', async () => {
            await new tool.version.CheckHandler('1.0.0').setNext(
                new NextHandler()
            ).handle();
            strictEqual(count, 100);
        });
    });
});
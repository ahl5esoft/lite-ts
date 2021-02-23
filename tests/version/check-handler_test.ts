import { ok, strictEqual } from 'assert';

import { CORBase } from '../../src/dp/cor-base';
import { CheckHandler } from '../../version/check-handler';

let count = 0;

class NextHandler extends CORBase {
    public async handle(): Promise<void> {
        count = 100;
    }
}

describe('version/check-handler.ts', () => {
    describe('.handle(): Promise<void>', () => {
        it('无效版本号', async () => {
            const self = new CheckHandler('a');
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
            await new CheckHandler('1.0.0').setNext(
                new NextHandler()
            ).handle();
            strictEqual(count, 100);
        });
    });
});
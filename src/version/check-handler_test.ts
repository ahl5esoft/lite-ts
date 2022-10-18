import { ok, strictEqual } from 'assert';

import { CheckHandler as Self } from './check-handler';
import { CORBase } from '../contract';

let count = 0;

class NextHandler extends CORBase {
    public async handle() {
        count = 100;
    }
}

describe('src/tool/version/check-handler.ts', () => {
    describe('.handle()', () => {
        it('无效版本号', async () => {
            const self = new Self('a');
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
            await new Self('1.0.0').setNext(
                new NextHandler()
            ).handle();
            strictEqual(count, 100);
        });
    });
});
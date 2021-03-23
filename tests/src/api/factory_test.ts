import { ok } from 'assert';

import { APIFactory } from '../../../src/api';
import { InvalidAPI } from '../../../src/api/invalid';

describe('src/api/factory.ts', (): void => {
    describe('.build(endpoint: string, apiName: string): Promise<IAPI>', (): void => {
        it('不存在', () => {
            const api = new APIFactory().build('a', 'b');
            ok(api instanceof InvalidAPI);
        });
    });
});
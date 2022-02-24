import { ClientOptions } from '@elastic/elasticsearch';
import { strictEqual } from 'assert';

import { ElasticSearchPool as Self } from './pool';

class TestPool { }

const clientOpts = {
    node: 'http://10.10.0.66:9200'
} as ClientOptions;

describe('src/service/elasticsearch/pool.ts', () => {
    describe('.getIndex(model: Function)', () => {
        it('ok', async () => {
            const self = new Self(clientOpts, 'test');

            const res = await self.getIndex(TestPool);
            strictEqual(res, `test.${TestPool.name.toLowerCase()}`);

            const isExist = await self.client.indices.exists({
                index: res
            });
            strictEqual(isExist, true);

            await self.client.indices.delete({
                index: res
            });
        });
    });
});
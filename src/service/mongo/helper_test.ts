import { deepStrictEqual } from 'assert';

import { toDoc, toEntries } from './helper';

describe('src/service/mongo/helper.ts', () => {
    describe('.toDoc(entry: any): any', () => {
        it('ok', () => {
            const res = toDoc({
                id: 'id',
                name: 'name'
            });
            deepStrictEqual(res, {
                _id: 'id',
                name: 'name'
            });
        });
    });

    describe('.toEntries(docs: any[]): any[]', () => {
        it('ok', () => {
            const res = toEntries([{
                _id: 'id',
                age: 11
            }]);
            deepStrictEqual(res, [{
                id: 'id',
                age: 11
            }]);
        });
    });
});
import { deepStrictEqual } from 'assert';

import { toDoc, toEntries } from '../../../../src/plugin/mongo/helper';

describe('src/plugin/mongo/helper.ts', (): void => {
    describe('.toDoc(entry: any): any', (): void => {
        it('ok', (): void => {
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

    describe('.toEntries(docs: any[]): any[]', (): void => {
        it('ok', (): void => {
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
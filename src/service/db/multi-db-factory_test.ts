import { deepStrictEqual } from 'assert';

import { MultiDbFactory as Self } from './multi-db-factory';
import { Mock } from '../assert';
import { DbFactoryBase } from '../..';

class Test { }

describe('src/service/db/multi-db-factory.ts', () => {
    it('.db<T>(model: new () => T, ...extra: any[])', () => {
        const mockDbFactory = new Mock<DbFactoryBase>({
            withTrace: null
        });
        const self = new Self({
            'a': mockDbFactory.actual
        });

        mockDbFactory.expectReturn(
            r => r.db(Test, undefined),
            {}
        );

        const res = self.db(Test, 'a');
        deepStrictEqual(res, {});
    });
});
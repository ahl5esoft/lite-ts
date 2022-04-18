import { deepStrictEqual } from 'assert';

import { DbMultiFactory as Self } from './multi-factory';
import { Mock } from '../assert';
import { DbFactoryBase } from '../..';

class Test { }

describe('src/service/db/multi-factory.ts', () => {
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
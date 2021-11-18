import { deepStrictEqual } from 'assert';

import { YamlConfigFactory as Self } from './config-factory';
import { Mock } from '../assert';
import { IOFileBase } from '../../contract';

class Default {
    public k: string;
}

describe('src/service/js-yaml/config-factory.ts', () => {
    describe('.build(model: Function)', () => {
        it('ok', async () => {
            const mockFile = new Mock<IOFileBase>();
            mockFile.expectReturn(
                r => r.readString(),
                `Default:
    k: v`
            );

            const res = await new Self(mockFile.actual).build(Default).get();
            deepStrictEqual(res, {
                k: 'v'
            });
        });
    });
});
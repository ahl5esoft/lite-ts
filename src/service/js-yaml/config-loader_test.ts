import { deepStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';

import { JsYamlConfigLoader as Self } from './config-loader';
import { IFile } from '../../contract';

class Test { }

describe('src/service/js-yaml/config-loader.ts', () => {
    describe('.load<T>(ctor: new () => T)', () => {
        it('延迟加载', async () => {
            const mockFile = new Mock<IFile>();
            const self = new Self(mockFile.actual);

            mockFile.expectReturn(
                r => r.readString(),
                `Test:
  a: 1`
            );

            const res = await self.load(Test);
            await self.load(Test);
            deepStrictEqual(res, {
                a: 1
            });

            const doc = Reflect.get(self, 'm_Doc');
            deepStrictEqual(doc, {
                Test: {
                    a: 1
                }
            });
        });

        it('不存在', async () => {
            const self = new Self(null);

            Reflect.set(self, 'm_Doc', {});

            const res = await self.load(Test);
            strictEqual(res, undefined);
        });
    });
});